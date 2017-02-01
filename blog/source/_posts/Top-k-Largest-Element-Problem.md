---
title: Top k Largest Element and kth Largest Element Problem
date: 2017-01-07 00:45:01
tags: [Algorithm]
permalink: Top-k-Largest-Element-Problem
---
This article analysis the top k largest/smallest element problem and the kth largest element problem. One of the method is based on QuickSelect and we will discuss the essential of this method then use it to solve extended problems.

All the algorithms to find top k elements introduced in this article also works for the kth largest problem. Therefore, we only focus on the top k largest problem from now. The problem of finding the kth largest/smallest number in a list or array is also called selection algorithm in computer science; such a number is called the kth order statistic. There are some statistic analysis on CLRS textbook so please refer to the textbook for more discussion.

# 1. The classic problem: find top k Largest elements
> Question: Write an efficient program for printing k largest elements in an array. Elements in array can be in any order.
> For example, if given array is [1, 23, 12, 9, 30, 2, 50] and you are asked for the largest 3 elements i.e., k = 3 then your program should print 50, 30 and 23.

<!--more-->
## Method 1: Nested loop (Bubble k times)
Loop k times. For the ith time, the ith largest element is selected. Such process is similar to Bubble Sort. Some other sorting algorithms like Selection Sort can also be modified to get the k largest elements.

Procedure:
1) Modify Bubble Sort to run the outer loop at most k times.
2) Print the last k elements of the array obtained in step 1.

Time Complexity: O(nk)

## Method 2: Sort the Array
A very simple solution is to sort the given array using a O(nlogn) sorting algorithm like Merge Sort, Heap Sort, etc and return the element at index k-1 in the sorted array.

Procedure
1) Sort the elements in descending order in O(n logn)
2) Print the first k numbers of the sorted array O(k).

Time complexity: O(nlogn)

## Method 3: Max Heap
1) Build a Max Heap tree in O(n)
2) Use Extract Max k times to get k maximum elements from the Max Heap O(klogn)

Time complexity: O(n + klogn)

## Method 4: Min Heap
A better solution than Method 3. We only need to maintain k candidates as the largest elements. Every time when we see a number n that is larger than the smallest element m among the candidates, we remove m and insert n. m should be in top of the heap so we will quickly get it and remove when necessary.

Procedure
1) Build a Min Heap MH of the first k elements (arr[0] to arr[k-1]) of the given array. Time complexity: O(k)
2) For each element, after the kth element (arr[k] to arr[n-1]), compare it with root of MH.
    a) If the element is greater than the root then make it root and call heapify for MH
    b) Else ignore it. Time complexity: O((n-k)\*logk)
3) Finally, MH has k largest elements and root of the MH is the kth largest element.

Time Complexity: O(k + (n-k)Logk) without sorted output. If sorted output is needed then O(k + (n-k)Logk + kLogk)

## Method 5: QuickSelect (Oder Statistics)
1) Use order statistic algorithm to find the kth largest element. Please see the topic selection in worst-case linear time O(n)
2) Use QuickSort Partition algorithm to partition around the kth largest number O(n).
3) Sort the k-1 elements (elements greater than the kth largest element) O(kLogk). This step is needed only if sorted output is required.

Time complexity: O(n) if we don’t need the sorted output, otherwise O(n+kLogk)

## Metohd 6: Blum-Floyd-Pratt-Rivest-Tarjan Algorithm
It is also worth mentioning that the Blum-Floyd-Pratt-Rivest-Tarjan algorithm that has a guaranteed O(n) running time.

# 2. Follow up problems
## The essential idea of QuickSelect
In QuickSelect, the `partition` procedure group a list (ranging from indices left to right) into two parts, those less than a certain element, and those greater than or equal to the element. After each partition, the unnecessary parts of the array is discarded. Therefore the performance of the algorithm is improved. We may also use this idea in other scenarios.

For example, in *Leetcode 230. Kth Smallest Element in a BST*, we may also use similar idea. Here is the solution:
```java
public int kthSmallest(TreeNode root, int k) {
    int count = countNodes(root.left);
    if (k <= count) {
        return kthSmallest(root.left, k);
    } else if (k > count + 1) {
        return kthSmallest(root.right, k-1-count); // 1 is counted as current node
    }
    return root.val;
}

public int countNodes(TreeNode n) {
    if (n == null) return 0;
    return 1 + countNodes(n.left) + countNodes(n.right);
}
```

## Kth element in 2-Dimension
See *Leetcode 378. Kth Smallest Element in a Sorted Matrix*. In this problem we want to find the kth **smallest** element in a matrix where each of the rows and columns are sorted in ascending order.

# 3. The kth Largest Element Problem
All of the above methods can also be used to find the kth largest (or smallest) element.

Example code using QuickSelect:
*LeetCode 215. Kth Largest Element in an Array*

> Find the kth largest element in an unsorted array. Note that it is the kth largest element in the sorted order, not the kth distinct element.
> For example,
> Given [3,2,1,5,6,4] and k = 2, return 5.
> Note:
> You may assume k is always valid, 1 ≤ k ≤ array's length.

```java
public class Solution {
    public int findKthLargest(int[] nums, int k) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        if (k <= 0) {
            return 0;
        }
        return findKth(nums, 0, nums.length - 1, nums.length - k + 1);
    }

    public int findKth(int[] nums, int l, int r, int k) {
        if (l == r) {
            return nums[l];
        }
        int position = partition(nums, l, r);
        if (position + 1 == k) {
            return nums[position];
        } else if (position + 1 < k) {
            return findKth(nums, position + 1, r, k);
        }  else {
            return findKth(nums, l, position - 1, k);
        }
    }

    public int partition(int[] nums, int l, int r) {
        // Init left pointer, right pointer and pivot
        int left = l, right = r;
        int pivot = nums[left];

        // Partition the array
        while (left < right) {
            while (left < right && nums[right] >= pivot) {
                right--;
            }
            nums[left] = nums[right];
            while (left < right && nums[left] <= pivot) {
                left++;
            }
            nums[right] = nums[left];
        }

        nums[left] = pivot;
        return left;         
    }
}
```
In the above code, Hoare partition is used. We may also use Lomuto partition by replacing the `partition` function using the following code:
```java
private int partition(int[] nums, int left, int right) {
    int pivot = nums[right];
    int i = left;
    for (int j = left; j < right; j++) {
        if (nums[j] >= pivot) {
            swap(nums, i, j);
            i++;
        }
    }
    swap(nums, i, right);
    return i;
}
```

# Reference
https://en.wikipedia.org/wiki/Selection_algorithm
http://www.geeksforgeeks.org/kth-smallestlargest-element-unsorted-array/
http://www.ardendertat.com/2011/05/30/my-favorite-interview-question/
