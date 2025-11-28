"""
Configuration Module for Multi-Agent Medical Assistant
Author: harshendram
Year: 2025
License: Apache 2.0

This module contains all configuration parameters for the medical AI system.
Modify LLM and embedding model settings by updating the respective class attributes.
Each model configuration has optimized temperature settings for specific use cases.
"""

import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

# Initialize environment variables
load_dotenv()

class AgentRouterConfig:
    """Configuration for agent routing and decision making."""
    def __init__(self):
        self.language_model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.1  # Deterministic routing
        )
        self.llm = self.language_model  # Backwards compatibility

class ConversationConfig:
    """Configuration for conversational agent interactions."""
    def __init__(self):
        self.language_model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.7  # Balanced creativity
        )
        self.llm = self.language_model  # Backwards compatibility

class WebSearchConfig:
    """Configuration for web search and retrieval operations."""
    def __init__(self):
        self.language_model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.3  # Factual with minimal creativity
        )
        self.llm = self.language_model  # Backwards compatibility
        self.history_context_limit = 20  # Conversation history window (10 Q&A pairs)

class RAGConfig:
    """Configuration for Retrieval-Augmented Generation system."""
    def __init__(self):
        self.vector_database_type = "qdrant"
        self.embedding_dimension = 768  # Gemini text-embedding-004 output size
        self.similarity_metric = "Cosine"  # Distance calculation method
        self.use_local_storage = True  # Local vs cloud deployment
        self.vector_storage_path = "./data/qdrant_db"
        self.document_storage_path = "./data/docs_db"
        self.parsed_documents_dir = "./data/parsed_docs"
        self.qdrant_url = os.getenv("QDRANT_URL")
        self.qdrant_api_key = os.getenv("QDRANT_API_KEY")
        self.vector_collection_name = "medical_assistance_rag"
        self.text_chunk_size = 512  # Document chunking size
        self.chunk_overlap_size = 50  # Overlapping tokens between chunks
        
        # Initialize embedding model
        self.embedding_model = GoogleGenerativeAIEmbeddings(
            model=os.getenv("EMBEDDING_MODEL_NAME", "models/text-embedding-004"),
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        
        # Primary language model
        self.language_model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.3  # Balanced factual responses
        )
        
        # Specialized models
        self.summary_generator = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.5  # More creative summaries
        )
        
        self.document_chunker = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.0  # Precise chunking
        )
        
        self.response_generator = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.3  # Factual responses
        )
        
        # Backwards compatibility
        self.llm = self.language_model
        self.summarizer_model = self.summary_generator
        self.chunker_model = self.document_chunker
        self.response_generator_model = self.response_generator
        self.vector_db_type = self.vector_database_type
        self.embedding_dim = self.embedding_dimension
        self.distance_metric = self.similarity_metric
        self.use_local = self.use_local_storage
        self.vector_local_path = self.vector_storage_path
        self.doc_local_path = self.document_storage_path
        self.parsed_content_dir = self.parsed_documents_dir
        self.url = self.qdrant_url
        self.api_key = self.qdrant_api_key
        self.collection_name = self.vector_collection_name
        self.chunk_size = self.text_chunk_size
        self.chunk_overlap = self.chunk_overlap_size
        
        self.top_k_results = 5
        self.vector_search_type = 'similarity'  # or 'mmr'
        self.top_k = self.top_k_results  # Backwards compatibility

        self.huggingface_token = os.getenv("HUGGINGFACE_TOKEN")

        self.reranker_model = "cross-encoder/ms-marco-TinyBERT-L-6"
        self.reranker_top_k = 3

        self.max_context_length = 8192  # (Change based on your need) # 1024 proved to be too low (retrieved content length > context length = no context added) in formatting context in response_generator code

        self.include_sources = True  # Show links to reference documents and images along with corresponding query response

        # ADJUST ACCORDING TO ASSISTANT'S BEHAVIOUR BASED ON THE DATA INGESTED:
        self.min_retrieval_confidence = 0.40  # The auto routing from RAG agent to WEB_SEARCH agent is dependent on this value

        self.context_limit = 20     # include last 20 messsages (10 Q&A pairs) in history

class MedicalCVConfig:
    """Configuration for medical computer vision models."""
    def __init__(self):
        self.chest_imaging_model_path = "./agents/image_analysis_agent/chest_xray_agent/models/covid_chest_xray_model.pth"
        self.skin_analysis_model_path = "./agents/image_analysis_agent/skin_lesion_agent/models/checkpointN25_.pth.tar"
        self.skin_output_visualization_path = "./uploads/skin_lesion_output/segmentation_plot.png"
        
        self.language_model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.1  # Deterministic for medical classification
        )
        
        # Backwards compatibility
        self.chest_xray_model_path = self.chest_imaging_model_path
        self.skin_lesion_model_path = self.skin_analysis_model_path
        self.skin_lesion_segmentation_output_path = self.skin_output_visualization_path
        self.llm = self.language_model

class SpeechConfig:
    """Configuration for text-to-speech services."""
    def __init__(self):
        self.elevenlabs_key = os.getenv("ELEVEN_LABS_API_KEY")
        self.default_voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
        
        # Backwards compatibility
        self.eleven_labs_api_key = self.elevenlabs_key
        self.eleven_labs_voice_id = self.default_voice_id

class ValidationConfig:
    def __init__(self):
        self.require_validation = {
            "CONVERSATION_AGENT": False,
            "RAG_AGENT": False,
            "WEB_SEARCH_AGENT": False,
            "CHEST_XRAY_AGENT": True,
            "SKIN_LESION_AGENT": True
        }
        self.validation_timeout = 300
        self.default_action = "reject"

class APIConfig:
    def __init__(self):
        self.host = "0.0.0.0"
        self.port = 8000
        self.debug = True
        self.rate_limit = 10
        self.max_image_upload_size = 5  # max upload size in MB

class UIConfig:
    def __init__(self):
        self.theme = "light"
        # self.max_chat_history = 50
        self.enable_speech = True
        self.enable_image_upload = True

class Config:
    \"\"\"Main configuration class - aggregates all sub-configurations.\"\"\"
    def __init__(self):
        self.agent_decision = AgentRouterConfig()
        self.conversation = ConversationConfig()
        self.rag = RAGConfig()
        self.medical_cv = MedicalCVConfig()
        self.web_search = WebSearchConfig()
        self.api = APIConfig()
        self.speech = SpeechConfig()
        self.validation = ValidationConfig()
        self.ui = UIConfig()
        self.eleven_labs_api_key = os.getenv("ELEVEN_LABS_API_KEY")
        self.tavily_api_key = os.getenv("TAVILY_API_KEY")
        self.max_conversation_history = 20  # Conversation context window

# # Example usage
# config = Config()