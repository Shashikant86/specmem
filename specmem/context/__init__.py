"""Streaming Context API for SpecMem.

Provides real-time context streaming and token budget optimization for AI agents.
"""

from specmem.context.estimator import TokenEstimator
from specmem.context.optimizer import ContextChunk, ContextOptimizer
from specmem.context.formatter import ContextFormatter
from specmem.context.profiles import AgentProfile, ProfileManager
from specmem.context.api import StreamingContextAPI, ContextResponse, StreamCompletion

__all__ = [
    "TokenEstimator",
    "ContextChunk",
    "ContextOptimizer",
    "ContextFormatter",
    "AgentProfile",
    "ProfileManager",
    "StreamingContextAPI",
    "ContextResponse",
    "StreamCompletion",
]
