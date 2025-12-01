"""Filter and query logic for SpecMem Web UI."""

from typing import List, Optional, Tuple

from specmem.core.specir import SpecBlock, SpecStatus, SpecType


def filter_blocks(
    blocks: List[SpecBlock],
    status: Optional[str] = None,
    block_type: Optional[str] = None,
) -> List[SpecBlock]:
    """Filter blocks by status and/or type with AND logic.
    
    Args:
        blocks: List of SpecBlocks to filter
        status: Filter by status ('active', 'legacy', or None/'' for all)
        block_type: Filter by type ('requirement', 'design', etc., or None/'' for all)
        
    Returns:
        Filtered list of SpecBlocks matching all specified criteria
    """
    result = blocks
    
    # Filter by status
    if status and status.lower() != "all":
        try:
            status_enum = SpecStatus(status.lower())
            result = [b for b in result if b.status == status_enum]
        except ValueError:
            # Invalid status, return empty
            return []
    
    # Filter by type
    if block_type and block_type.lower() != "all":
        try:
            type_enum = SpecType(block_type.lower())
            result = [b for b in result if b.type == type_enum]
        except ValueError:
            # Invalid type, return empty
            return []
    
    return result


def calculate_counts(blocks: List[SpecBlock]) -> Tuple[int, int, int, int]:
    """Calculate counts for a list of blocks.
    
    Args:
        blocks: List of SpecBlocks
        
    Returns:
        Tuple of (total, active_count, legacy_count, pinned_count)
    """
    total = len(blocks)
    active_count = sum(1 for b in blocks if b.status == SpecStatus.ACTIVE)
    legacy_count = sum(1 for b in blocks if b.status == SpecStatus.LEGACY)
    pinned_count = sum(1 for b in blocks if b.pinned)
    
    return total, active_count, legacy_count, pinned_count


def count_by_type(blocks: List[SpecBlock]) -> dict[str, int]:
    """Count blocks by type.
    
    Args:
        blocks: List of SpecBlocks
        
    Returns:
        Dictionary mapping type name to count
    """
    counts: dict[str, int] = {}
    for block in blocks:
        type_name = block.type.value
        counts[type_name] = counts.get(type_name, 0) + 1
    return counts


def count_by_source(blocks: List[SpecBlock]) -> dict[str, int]:
    """Count blocks by source file.
    
    Args:
        blocks: List of SpecBlocks
        
    Returns:
        Dictionary mapping source file to count
    """
    counts: dict[str, int] = {}
    for block in blocks:
        counts[block.source] = counts.get(block.source, 0) + 1
    return counts


def get_pinned_blocks(blocks: List[SpecBlock]) -> List[SpecBlock]:
    """Get all pinned blocks.
    
    Args:
        blocks: List of SpecBlocks
        
    Returns:
        List of pinned SpecBlocks
    """
    return [b for b in blocks if b.pinned]
