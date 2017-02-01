---
title: Manacher's Algorithm
date: 2016-11-19 21:27:52
tags: [Algorithm]
permalink: Manacher-s-Algorithm
---
Manacher's Algorithm can find a longest palindrome in a string in linear time. The essential of this algorithm is that it takes advantage of the following characteristics or observations about a palindrome and a sub-palindrome: the left side of a palindrome is a mirror image of its right side. This article firstly provides the code and then analyses the process of Manacher's algorithm.

Let's take an example: *Leetcode 5. Longest Palindromic Substring*. Here is the code that I submitted.

<!--more-->
```java
public class Solution {

    private char[] init(char[] c) {
        int i, j;
        char[] s = new char[c.length * 2 + 2];
        s[0] = '@';
        for(i = 0; i < c.length; i++) {
            s[2 * i + 1] = '#';
            s[2 * i + 2] = c[i];
        }
        s[2 * i + 1] = '#';
        return s;
    }

    public String longestPalindrome(String line) {
    	int id = 0, mx = 0;
        char[] c = line.toCharArray();
        char[] s = init(c);
        int[] p = new int[s.length];
        for (int i = 1; i < s.length; i++) {
            p[i] = mx > i ? Math.min(p[2 * id - i], mx - i) : 1;
            while ((i + p[i] < s.length) && (s[i + p[i]] == s[i - p[i]])) {
                p[i]++;
            }
            if (i + p[i] > mx) {
                mx = i + p[i];
                id = i;
            }
        }
        mx = 0;
        int r = 0;
        for (int i = 1; i < s.length; i++) {
            if(p[i] > mx) {
                mx = p[i];
                r = i;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = r - mx + 1; i < r + mx; i++) {
            if (s[i] != '@' && s[i] != '#') {
                sb.append(s[i]);
            }
        }
        return sb.toString();
    }
}
```

Some other straightforward and fundamental problems using Manacher's algorithm:
- http://poj.org/problem?id=3974
- http://acm.hdu.edu.cn/showproblem.php?pid=3068

A very good reference for this algorithm: https://www.felix021.com/blog/read.php?2040

The following is how the author explained in the article:

Originated from:
http://blog.csdn.net/ggggiqnypgjg/article/details/6645824
http://zhuhongcheng.wordpress.com/2009/08/02/a-simple-linear-time-algorithm-for-finding-longest-palindrome-sub-string/

After reading articles listed above and 3 days' thinking, I finally got the idea. In order to save time after forgetting, I decided to record the thoughts here.

First, a clever method is applied to the string to convert all possible LPS to odd-length ones ---- by adding a special char for each gap between chars. For instance, "abba" is transformed to "#a#b#b#a#", and "aba" to "#a#b#a#". To make it simpler, another special char is prepended to the string, thus avoiding extra trival codes to deal with boundary, for example, "$#a#b#b#a#". NOTICE: the code below is written in C, which requires an extra '\0' at the end of a "string"; if you're using another language like python/php, I suggest you add another special char at the end, otherwise you may get over the boundary.

Below I'll explain with "12212321", which in the previous step, is transformed to S = "$#1#2#2#1#2#3#2#1#".

Then I'll use P[i] to record the width (half the length including S[i]) of the Palindromic Substring(PS) which takes S[i] as its center. The relation is shown below:

```
S  #  1  #  2  #  2  #  1  #  2  #  3  #  2  #  1  #
P  1  2  1  2  5  2  1  4  1  2  1  6  1  2  1  2  1
(p.s. You can see that P[i] - 1 is actually the length of the original PS)
```

Now the problem is: how to compute P[i]? If we use two extra variables id and mx, where id represents the center of the currently known palindrome sub-string which has the rightmost boundary, and mx represents id + P[id], i.e. the right boundary of that sub-string, then we get to the key point of this algorithm:

If mx > i, then P[i] >= MIN(P[2 * id - i], mx - i).

It looks confusing, and I was stuck at this very point for a long time. But if we unfold the formula, we can get much better understanding:

```java
//let j = 2 * id - i, i.e. the symmetric point of i referring to id
if (mx - i > P[j])
    P[i] = P[j];
else /* P[j] >= mx - i */
    P[i] = mx - i; //since P[i] >= mx - i, we have to match afterwards since here.
```

The code may not be clear enough, but with graphs we can do better.

When mx - i > p[j], PS(center=S[j]) is contained by PS(center=S[id]), since the symmetry of i and j, obviously PS(center=S[i]) will be contained by PS(center=S[id]) as well, therefore P[i] = P[j].

![](/images/Manacher-s-Algorithm-1.png)

And when P[j] >= mx - i, PS(center=S[j]) is partially contained by PS(center=S[id]), we can assume that at least segments in green boxes (below in the graph) will be the same according to symmetry, which means that PS(center=S[i]) will extend rightwards at least to mx, i.e. P[i] >= mx - i. As for more to the right, we have no choice but to compare forwards char by char.

![](/images/Manacher-s-Algorithm-2.png)

For cases when mx <= i, we can make no assumption, so, just let P[i] = 1, and compare forwards char by char.

OK, here's the key code:

```java
//Input and transform to s
int p[1000], mx = 0, id = 0;
memset(p, 0, sizeof(p));
for (i = 1; s[i] != '\0'; i++) {
    p[i] = mx > i ? min(p[2*id-i], mx-i) : 1;
    while (s[i + p[i]] == s[i - p[i]]) p[i]++;
    if (i + p[i] > mx) {
        mx = i + p[i];
        id = i;
    }
}
//find the max P[i]
```

OVER.

\#UPDATE@2013-08-21 14:27
as @zhengyuee pointed out that, since P[id] = mx, therefore S[id-mx] != S[id+mx]. Then, when P[j] > mx - i, we can be sure that P[i] will be just mx - i and no larger. However, neglecting this in practise will only result in an extra comparision (which will definitely fail), while an extra branch have to be added to the code as well, so just neglecting it is fine :)
