---
title: Find All Palindrome Substrings
date: 2016-09-25 09:23:13
tags: [Algorithm]
permalink: Find-All-Palindrome-Substrings
---
This article provides the code to find all palindrome substrings in a given string.

Code:
<!--more-->
```cpp
// Find all palindrome substrings in a given string
// (C)2012 mgr Jerzy Wałaszek
//-----------------------------
#include <iostream>
#include <string>
#include <cstdlib>
#include <time.h>

using namespace std;

string s = "abcacbbbca";   // string to be analyzed
const int N = 10;          // length of s

int main()
{
    int i, j, k,   // iterators
    rp,        // length of 'palindrome radius'
    R[2][N+1]; // table for storing results (2 rows for odd- and even-length palindromes

    // print s first

    cout << s << endl;

    // ...then search for palindromes

    s = "@" + s + "#"; // insert 'guards' to iterate easily over s

    for (j = 0; j <= 1; j++)
    {
        R[j][0] = rp = 0; i = 1;
        while(i <= N)
        {
            while(s[i - rp - 1] == s[i + j + rp]) rp++;
            R[j][i] = rp;
            k = 1;
            while((R[j][i - k] != rp - k) && (k < rp))
            {
                R[j][i + k] = min(R[j][i - k],rp - k);
                k++;
            }
            rp = max(rp - k,0);
            i += k;
        }
    }

    s = s.substr(1,N); // remove 'guards'

    // print the results

    for (i = 1; i <= N; i++)
    {
        for (j = 0; j <= 1; j++)
            for (rp = R[j][i]; rp > 0; rp--)
            {
                for(k = 1; k < i - rp; k++) cout << " ";
                cout << s.substr(i - rp - 1,2 * rp + j) << endl;
            }
    }
    cout << endl;
    return 0;
}
```
Output:
```
abcacbbbca
 bcacb
  cac
     bb
   acbbbca
    cbbbc
     bbb
      bb
```
