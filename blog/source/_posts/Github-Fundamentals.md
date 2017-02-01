---
title: Github Fundamentals
date: 2015-11-05 04:45:55
tags: [Git, Tools]
permalink: Github-Fundamentals
---
This article introduces how to set up Git and GitHub in a new computer and introduces some fundamental commands.

# Set Up Git and GitHub
## 1 Configure GitHub user information on local computer
First download and install the latest version of Git. To set up user information for GitHub, open a terminal and type:
```
git config --global user.name “your_name”
git config --global user.email “email@email.com”
```
If the commands are used without "--global", the *user.name* and *user.email* are only valid under current repository.

<!--more-->
## 2 Create a new repository on GitHub
Log in to http://www.github.com with your GitHub account. Click "New repository" button. Type your repository name (do not click "Initialize this repository with a README") and then click "Create repository" button.

## 3 Authenticating with SSH keys
### 3.1 Generate SSH keys and authenticate
Type the following command on terminal:
```
ssh-keygen -C "email@email.com" -t rsa
```

The console will show "Generating public/private rss key pair" and ask the path to save SSH Keygen files. The default path is ~/ and you may press Enter. Then type password and re-enter the password.

To ensure that it is configured correctly, type:

```
ssh -T git@github.com
```
If the authentication is successful, you will see:
>You’ve successfully authenticated, but GitHub does not provide shell access.

### 3.2 Add the SSH key to GitHub
Go to the folder that we used to save SSH keys. By default it is ~/.ssh, as we chose in 3.1 and we can see it with ls -a command under \*nix systems. In this folder, id_rsa is private key file and id_rsa.pub is public key file. Open id_rsa.pub with vi, copy the whole content (including the "ssh-rsa" in the beginning).

Then log in with your GitHub account on http://www.github.com, click "account settings" on the top right corner. Select "SSH keys" on the sidebar and then click "Add SSH" button, paste the content that we copied just now. The title of the SSH key can be whatever you want.

## 4 Create a local repository and push it to GitHub
Go to a folder that you want to push to GitHub, or create a new folder as a repository. The following commands will respectively initialize the repository, add files to staging area, and then commit files:
```
git init
git add .
git commit -m "Commit Info"
```
The 3 commands above have committed your code as a new "version" that is saved in your local repository. To synchronize our code with GitHub, we need to link our local repository and the remote repository on GitHub. To do so, we will firstly add *remote* to our repository. Name the remote repository as "remote". The command is:
```
git remote add origin git@github.com:YourName/YourRepositroy.git
```
We only need to add origin once. After that we use the following command to push the committed code to origin.
```
git push -u origin master
```

# Some useful Git commands
## Show the working tree status.
```
    git status
```
Displays paths that have differences between the index file and the current HEAD commit, paths that have differences between the working tree and the index file, and paths in the working tree that are not tracked by Git.

## .gitignore file
Sometimes we want to ignore some certain files. For example, the files in bin/ folder, which are typically used to store executive programs and they are not needed to upload to GitHub. Add the files that you want to ignore in .gitignore file.

# Collaborate with others
## Fork and Pull Requests
You may fork others' repository and push your code to the forked repository the same way as you are dealing with your own repository. If you want to have your work merged to the original repository, click `Pull request` on Github and the original repository owner will merge your branch to its repository.

## Push to the Same Repository
On Github, the repository owner can add contributors so they have the authority to push their code directly to the repository.
