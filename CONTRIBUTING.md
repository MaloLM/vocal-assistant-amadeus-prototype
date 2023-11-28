# Contributor's Guide

Thank you for considering contributing to this project. This guide provides information about how to contribute and help make this project better.

## Table of Contents
1. [Setting Up the Development Environment](#setting-up-the-development-environment)
2. [Finding Issues to Work On](#finding-issues-to-work-on)
3. [Creating a Pull Request](#creating-a-pull-request)
4. [Coding Standards](#coding-standards)
5. [Additional Notes](#additional-notes)

## Setting Up the Development Environment

1. **Fork the Repository**: Start by forking [the main repository](LINK_TO_MAIN_REPO).
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/MaloLM/vocal-assistant-amadeus-prototype.git
   ```
3. **Navigate to the directory**:
   ```bash
   cd vocal-assistant-amadeus-prototype
   ```
4. **Add Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/MaloLM/vocal-assistant-amadeus-prototype.git
   ```
5. **Install Dependencies**:
   Inside both node-server and electron directory: 
   ```bash
   npm install
   ```

## Finding Issues to Work On

- Check out the "Good First Issues" label in the issues tab of the main repository.
- Once you find an issue you'd like to work on, add this issue to the github repo tab to notify that you are working on it.

## Creating a Pull Request

1. **Update Your Fork**:
   ```bash
   git fetch upstream
   git merge upstream/main main
   ```
2. **Create a New Branch**:
   ```bash
   git checkout -b branch-name
   ```
3. **Make Your Changes**.
4. **Commit and Push Your Changes**:
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push origin branch-name
   ```
5. Navigate to the GitHub page of your fork, and click on "New Pull Request".
6. Ensure the base branch is the main branch of the main repository, and the compare branch is your branch with changes.

## Coding Standards

- Ensure your code is properly formatted.
- Write meaningful commit messages.
- Add comments explaining complex sections of your code.
- Ensure the project builds/tests pass after your changes.

## Additional Notes

- If your PR addresses a particular issue, use `fixes #ISSUE_NUMBER` in your commit message or PR description.
- Please be respectful and considerate to other contributors. Adhere to the Code of Conduct.
