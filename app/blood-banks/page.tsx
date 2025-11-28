"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { MapPin, Search, Droplets, Navigation, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import PageTransition from "@/components/ui/page-transition"
import { useToast } from "@/hooks/use-toast"

interface BloodBank {
  name: string
  location: string
  distance?: number
  phone?: string
  hours?: string
}

export default function BloodBanksPage() {
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState([5])
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<BloodBank[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    try {
      // Call the blood bank search API
      const response = await fetch("/api/blood-banks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: location,
          radius: radius[0],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to search blood banks")
      }

      const data = await response.json()
      setResults(data.centers || [])
      setHasSearched(true)

      toast({
        title: "Success",
        description: `Found ${data.centers?.length || 0} blood banks near ${location}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search blood banks",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Droplets className="w-4 h-4 text-red-400" />
              <span className="text-sm text-white/90">Find Blood Banks Near You</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Blood Bank Locator
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Search for nearby blood donation centers and blood banks in your area
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Search Card */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 sticky top-8">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Enter city or address"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:ring-gray-500"
                      />
                    </div>
                    <p className="text-xs text-white/50">e.g., Bengaluru, Delhi, Mumbai</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Search Radius</Label>
                    <div className="space-y-3">
                      <Slider
                        value={radius}
                        onValueChange={setRadius}
                        min={1}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between px-2">
                        <span className="text-sm text-white/70">1 km</span>
                        <span className="text-lg font-bold text-white bg-gray-800 px-3 py-1 rounded">
                          {radius[0]} km
                        </span>
                        <span className="text-sm text-white/70">50 km</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 h-11"
                  >
                    {isSearching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        className="w-5 h-5"
                      >
                        <Search className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2 inline" />
                        Search
                      </>
                    )}
                  </Button>
                </form>

                {/* Info Card */}
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-300">
                    <Droplets className="w-4 h-4 inline mr-2" />
                    Blood donation saves lives. Consider donating today!
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              {!hasSearched ? (
                <Card className="p-12 bg-white/5 backdrop-blur-md border-white/10 text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-white/70 text-lg">
                    Enter a location and search radius to find nearby blood banks
                  </p>
                </Card>
              ) : results.length === 0 ? (
                <Card className="p-12 bg-white/5 backdrop-blur-md border-white/10 text-center">
                  <Droplets className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-white/70 text-lg">
                    No blood banks found near {location}. Try adjusting the radius or location.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="text-white/70 mb-6">
                    <p className="text-sm">
                      Found <span className="font-bold text-white">{results.length}</span> blood bank
                      {results.length !== 1 ? "s" : ""} within {radius[0]} km of {location}
                    </p>
                  </div>

                  {results.map((bank, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                              {bank.name}
                            </h3>
                            <div className="flex items-center gap-2 text-white/70 mt-1">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{bank.location}</span>
                            </div>
                          </div>
                          {bank.distance && (
                            <div className="text-right">
                              <span className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-red-300 text-sm font-medium">
                                {bank.distance.toFixed(1)} km away
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                          {bank.phone && (
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                              <Phone className="w-4 h-4" />
                              <span>{bank.phone}</span>
                            </div>
                          )}
                          {bank.hours && (
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{bank.hours}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          className="w-full mt-4 bg-white hover:bg-gray-200 text-black font-semibold"
                          onClick={() => {
                            window.open(
                              `https://www.google.com/maps/search/${bank.name} ${bank.location}`,
                              "_blank"
                            )
                          }}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
