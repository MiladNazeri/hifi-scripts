# EZ Bash Editing
# ################################################################
# Fast edit this bash file
alias sb="source ~/.bashrc"
alias cb="code ~/.bashrc"


# Built in modifiers
# ################################################################
# This will show the directory contents every time you go into a new directory
cd() {
    builtin cd $@
    ll
}


# Git Functions
# ################################################################
# Push this branch to a tracked upstream with a commit messageg
function gp(){ 
   git add .
   git commit -m "$1"
   git push
}

# Just commit don't push.  Optional commit message
function gc(){
    git add .
    git commit -m "$1"
}

# Set this branch to have a designated upstream for easy push and pull
function up(){
    git branch --set-upstream-to=$1/$2
}

# Checkout a branch.  You can also do co -b branch if you want to make one
function co(){
    git checkout $1 $2
}

# shortcut for the sync function
function s(){
    sync
}

# push with several defaults made
function pu(){
    if [[ -z "$1" ]] ; then
        echo "pulling origin master"
        git pull origin master 
    fi 
    if [[ $1 == "o" ]] ; then
        echo "pulling origin ${2:-master}"
        git pull origin ${2:-master}
    elif [[ $1 == "u" ]] ; then  
        echo "pulling upstream ${2:-master}"
        git pull upstream ${2:-master}
    fi
}

# get the status 
function gs() {
    git status
}

# get logs with a default of the last 10 but you can change that with an argument
function gl() {
    git log --oneline ${1:--10}
}

# Fetch a repo or all repos
function gf() {
    git fetch ${1:---all}
}

function gb() {
    git branch $1
}

# push a dir
function p(){
    pushd $1
}

# pop a dir
function pd(){
    popd $1
}

# format list of directories
function d(){
    dirs -v $1
}


# AWS SYNC
# ################################################################
# syncs my current folder with my s3.  Number one game changer for me.  
sync() {
    dir=$PWD
    cut=${dir##*_ROLC}
    bucket=hifi-content/milad/ROLC
    final=$bucket$cut
    echo $final
    if [[ "$final" =~ /hifi-content$ ]]; then
        echo "in the base directory"
        return 0
    fi
    "/d/ROLC/Reference/R_Programs/AWS/bin/aws.cmd" s3 sync . s3://$final --exclude '.git/*'
}


# Exports
# ################################################################
export PATH="$PATH:/d/ROLC/Reference/R_Programs/AWS/bin"


# Aliases
# ################################################################
# Shortcuts to my hifi folder, and one for vscode to open up a workspace with all 3 hifi repos
alias scripts="cd '/d/Dropbox (milad productions)/_ROLC/Organize/O_Projects/Hifi/Scripts'"
alias content="cd /d/ROLC_High-Fidelity/02_Organize/O_Projects/Repos/hifi-content"
alias milad="cd /d/ROLC_High-Fidelity/02_Organize/O_Projects/Repos/hifi"
alias hifi="cd /d/ROLC_High-Fidelity/02_Organize/O_Projects/Repos/hifi-scripts"
alias repo="cd /d/ROLC_High-Fidelity/02_Organize/O_Projects/Repos"
alias hc="repo; code hifi.code-workspace"
