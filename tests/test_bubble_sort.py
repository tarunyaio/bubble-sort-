import unittest
from bubble_sort import bubble_sort

class TestBubbleSort(unittest.TestCase):
    
    def test_already_sorted(self):
        """Test array that is already sorted."""
        arr = [1, 2, 3, 4, 5]
        self.assertEqual(bubble_sort(arr.copy()), [1, 2, 3, 4, 5])

    def test_reverse_sorted(self):
        """Test array sorted in reverse order."""
        arr = [5, 4, 3, 2, 1]
        self.assertEqual(bubble_sort(arr.copy()), [1, 2, 3, 4, 5])

    def test_unsorted_array(self):
        """Test a random unsorted array."""
        arr = [64, 34, 25, 12, 22, 11, 90]
        self.assertEqual(bubble_sort(arr.copy()), [11, 12, 22, 25, 34, 64, 90])
        
    def test_duplicates(self):
        """Test array with duplicate elements."""
        arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
        self.assertEqual(bubble_sort(arr.copy()), [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9])
        
    def test_empty_array(self):
        """Test an empty array."""
        arr = []
        self.assertEqual(bubble_sort(arr.copy()), [])
        
    def test_single_element(self):
        """Test array with a single element."""
        arr = [42]
        self.assertEqual(bubble_sort(arr.copy()), [42])

if __name__ == '__main__':
    unittest.main()
