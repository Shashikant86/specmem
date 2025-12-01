"""SpecMemClient - Python API for agent integration.

Provides a simple interface for coding agents to interact with SpecMem.
"""

from specmem.client.client import SpecMemClient
from specmem.client.models import (
    ContextBundle,
    Proposal,
    ProposalStatus,
    SpecSummary,
    TestMapping,
)
from specmem.client.exceptions import (
    SpecMemError,
    ConfigurationError,
    MemoryStoreError,
    ProposalError,
)

__all__ = [
    "SpecMemClient",
    "ContextBundle",
    "Proposal",
    "ProposalStatus",
    "SpecSummary",
    "TestMapping",
    "SpecMemError",
    "ConfigurationError",
    "MemoryStoreError",
    "ProposalError",
]
