import requests
import json
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import time
import os
from dotenv import load_dotenv
import folium
from folium.plugins import HeatMap
import webbrowser

load_dotenv()

def find_nearby_blood_donation_centers_free(location_query: str, radius_km: int = 5):
    """
    Free alternative using OpenStreetMap data via Overpass API
    """
    try:
        # 1. FREE GEOCODING using Nominatim
        geolocator = Nominatim(user_agent="blood_donation_app")
        location = geolocator.geocode(location_query)
        
        if not location:
            return f"Could not find coordinates for: {location_query}"
        
        lat, lng = location.latitude, location.longitude
        print(f"Searching near: {lat}, {lng}")

        # 2. FREE PLACES SEARCH using Overpass API (OpenStreetMap)
        # Create bounding box around the location
        offset = radius_km / 111.0  # Rough conversion to degrees
        south = lat - offset
        west = lng - offset
        north = lat + offset
        east = lng + offset
        
        # Overpass query to find blood donation centers (medical only, not financial banks)
        overpass_query = f"""
        [out:json][timeout:25];
        (
          nwr["amenity"="hospital"]["healthcare:speciality"~"blood_donation|blood_bank"]({south},{west},{north},{east});
          nwr["amenity"="blood_bank"]({south},{west},{north},{east});
          nwr["healthcare"="blood_donation"]({south},{west},{north},{east});
          nwr["amenity"="clinic"]["healthcare:speciality"~"blood_donation|blood_bank"]({south},{west},{north},{east});
          nwr["amenity"="hospital"]["name"~"blood.*bank|blood.*donation|blood.*center"]({south},{west},{north},{east});
          nwr["amenity"="clinic"]["name"~"blood.*bank|blood.*donation|blood.*center"]({south},{west},{north},{east});
          nwr["healthcare"="centre"]["healthcare:speciality"~"blood"]({south},{west},{north},{east});
        );
        out center;
        """
        
        overpass_url = "http://overpass-api.de/api/interpreter"
        response = requests.post(overpass_url, data=overpass_query, timeout=30)
        
        print(f"Response status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error response: {response.text}")
            return f"Error fetching data from OpenStreetMap: {response.status_code}"
        
        data = response.json()
        
        if not data.get('elements'):
            return "No nearby blood donation centers found in OpenStreetMap data"
        
        # 3. PROCESS RESULTS
        centers = []
        user_location = (lat, lng)
        
        for element in data['elements']:
            # Get coordinates
            if element['type'] == 'way' or element['type'] == 'relation':
                if 'center' in element:
                    center_lat = element['center']['lat']
                    center_lon = element['center']['lon']
                else:
                    continue
            else:  # node
                center_lat = element['lat']
                center_lon = element['lon']
            
            # Calculate distance
            center_location = (center_lat, center_lon)
            distance = geodesic(user_location, center_location).kilometers
            
            if distance <= radius_km:
                tags = element.get('tags', {})
                
                # Filter out financial institutions
                name = tags.get('name', 'Unnamed Blood Center').lower()
                amenity = tags.get('amenity', '').lower()
                
                # Skip if it's clearly a financial bank
                financial_keywords = ['state bank', 'hdfc bank', 'icici bank', 'axis bank', 'canara bank', 
                                    'corporation bank', 'syndicate bank', 'yes bank', 'reserve bank',
                                    'south indian bank', 'union bank', 'indian bank', 'punjab bank']
                
                if amenity == 'bank' or any(keyword in name for keyword in financial_keywords):
                    continue
                
                # Only include if it's likely a medical facility
                medical_keywords = ['hospital', 'clinic', 'blood bank', 'blood donation', 'blood center', 
                                  'medical', 'health', 'blood centre']
                
                if not any(keyword in name or keyword in amenity for keyword in medical_keywords):
                    # Check if it has healthcare-related tags
                    healthcare = tags.get('healthcare', '').lower()
                    speciality = tags.get('healthcare:speciality', '').lower()
                    if not ('blood' in healthcare or 'blood' in speciality):
                        continue
                
                center_info = {
                    'name': tags.get('name', 'Unnamed Blood Center'),
                    'address': tags.get('addr:full') or 
                              f"{tags.get('addr:street', '')}, {tags.get('addr:city', '')}".strip(', '),
                    'phone': tags.get('phone', tags.get('contact:phone', 'N/A')),
                    'latitude': center_lat,
                    'longitude': center_lon,
                    'distance_km': round(distance, 2),
                    'opening_hours': tags.get('opening_hours', 'N/A'),
                    'website': tags.get('website', tags.get('contact:website', 'N/A')),
                    'facility_type': tags.get('amenity', tags.get('healthcare', 'medical_facility'))
                }
                centers.append(center_info)
        
        # Sort by distance
        centers.sort(key=lambda x: x['distance_km'])
        return centers[:10]  # Return top 10 closest
        
    except Exception as e:
        return f"An error occurred during the search: {e}"

# Install required packages first
# pip install geopy requests

def create_blood_center_heatmap(location_query: str, radius_km: int = 5, save_path: str = "blood_centers_heatmap.html"):
    """
    Creates an interactive heatmap of blood donation centers
    """
    # Get blood centers data
    centers = find_nearby_blood_donation_centers_free(location_query, radius_km)
    
    if isinstance(centers, str):  # Error message
        print(f"Error: {centers}")
        return None
    
    if not centers:
        print("No blood centers found to create heatmap")
        return None
    
    # Get center location for map
    geolocator = Nominatim(user_agent="blood_donation_app")
    location = geolocator.geocode(location_query)
    center_lat, center_lng = location.latitude, location.longitude
    
    # Create base map
    m = folium.Map(
        location=[center_lat, center_lng],
        zoom_start=13,
        tiles='OpenStreetMap'
    )
    
    # Prepare data for heatmap
    heat_data = []
    
    # Add markers and collect heatmap data
    for center in centers:
        lat = center['latitude']
        lng = center['longitude']
        
        # Add to heatmap data (lat, lng, weight)
        # Weight based on inverse of distance (closer = higher weight)
        weight = max(1, 10 - center['distance_km'])
        heat_data.append([lat, lng, weight])
        
        # Create popup info
        popup_html = f"""
        <div style="width: 300px">
            <h4 style="color: #d32f2f;">{center['name']}</h4>
            <p><b>📍 Address:</b> {center['address'] or 'Not available'}</p>
            <p><b>📞 Phone:</b> {center['phone']}</p>
            <p><b>🕒 Hours:</b> {center['opening_hours']}</p>
            <p><b>📏 Distance:</b> {center['distance_km']} km</p>
            <p><b>🏥 Type:</b> {center['facility_type']}</p>
            {f'<p><b>🌐 Website:</b> <a href="{center["website"]}" target="_blank">Visit</a></p>' if center['website'] != 'N/A' else ''}
            <hr>
            <div style="text-align: center;">
                <a href="https://www.google.com/maps/dir/?api=1&destination={lat},{lng}" 
                   target="_blank" 
                   style="background-color: #4285f4; color: white; padding: 8px 16px; 
                          text-decoration: none; border-radius: 4px; font-weight: bold;
                          display: inline-block;">
                    🗺️ Get Directions
                </a>
            </div>
        </div>
        """
        
        # Add marker to map
        folium.Marker(
            [lat, lng],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=center['name'],
            icon=folium.Icon(color='red', icon='plus-sign', prefix='glyphicon')
        ).add_to(m)
    
    # Add heatmap layer
    if heat_data:
        HeatMap(
            heat_data,
            min_opacity=0.3,
            max_zoom=18,
            radius=25,
            blur=15,
            gradient={0.2: 'blue', 0.4: 'lime', 0.6: 'orange', 1: 'red'}
        ).add_to(m)
    
    # Add search center marker
    folium.Marker(
        [center_lat, center_lng],
        popup=f"Search Center: {location_query}",
        tooltip="Your Search Location",
        icon=folium.Icon(color='green', icon='star', prefix='glyphicon')
    ).add_to(m)
    
    # Add radius circle
    folium.Circle(
        [center_lat, center_lng],
        radius=radius_km * 1000,  # Convert km to meters
        popup=f"Search Radius: {radius_km} km",
        color="green",
        weight=2,
        fill=True,
        fillColor="green",
        fillOpacity=0.1
    ).add_to(m)
    
    # Add layer control
    folium.LayerControl().add_to(m)
    
    # Save map
    m.save(save_path)
    print(f"Heatmap saved as: {save_path}")
    print(f"Found {len(centers)} blood centers within {radius_km} km")
    
    # Open in browser
    try:
        webbrowser.open(save_path)
        print("Opening heatmap in your default browser...")
    except:
        print(f"Please open {save_path} in your browser to view the heatmap")
    
    return m

# Example usage
search_results = find_nearby_blood_donation_centers_free("Bengaluru, India", radius_km=5)
print(json.dumps(search_results, indent=2))

# Create heatmap
print("\n" + "="*50)
print("Creating Interactive Heatmap...")
print("="*50)
create_blood_center_heatmap("Bengaluru, India", radius_km=5)