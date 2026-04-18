def bubble_sort(arr: list[int]) -> list[int]:
    """
    Sorts a list of integers in ascending order using the Bubble Sort algorithm.
    
    This implementation includes an early exit optimization: if no swaps 
    occur during a pass, the array is already sorted and the algorithm terminates.
    
    Args:
        arr (list[int]): The list of integers to be sorted.
        
    Returns:
        list[int]: The sorted list.
    """
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        swapped = False
        
        # Last i elements are already in place, so we don't need to check them
        for j in range(0, n - i - 1):
            
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                
        # If no two elements were swapped by inner loop, then break
        if not swapped:
            break
            
    return arr
