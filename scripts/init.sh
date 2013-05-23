#!/bin/bash

echo "Running init script..."

enyomkdir=$(mkdir src/main/webapp/enyo 2>&1)
if [[ $enyomkdir =~ 'exists' ]]; then
    echo "Project already initialized. Moving right along."
else
    rm -rf src/main/webapp/enyo # git will complain if I don't remove it
    ROOT=`pwd`

    ENYOVERSION='2.1.1'
    UNDERSCOREVERSION='1.4.3'
    LESSVERSION='1.3.3'

    mkdir -p src/main/webapp/lib

    git init

    echo ">> Adding submodule enyo $ENYOVERSION..."
    git submodule add git@github.com:NBTSolutions/enyo.git src/main/webapp/enyo --quiet
    cd src/main/webapp/enyo
    git checkout $ENYOVERSION-jasmine-enabled --quiet

    echo ">> Adding submodule onyx $ENYOVERSION..."
    cd $ROOT
    git submodule add https://github.com/enyojs/onyx.git src/main/webapp/lib/onyx --quiet
    cd src/main/webapp/lib/onyx
    git checkout $ENYOVERSION --quiet

    echo ">> Adding submodule layout $ENYOVERSION..."
    cd $ROOT
    git submodule add https://github.com/enyojs/layout src/main/webapp/lib/layout --quiet
    cd src/main/webapp/lib/layout
    git checkout $ENYOVERSION --quiet

    cd $ROOT
    echo ">> Initial Commit..."
    git add *
    git add .gitignore
    git add .lvimrc
    git commit -m "enyo $ENYOVERSION archetype installed." --quiet

    echo "Done."
    echo "Several other scripts are included in the comments of debug.html."
    echo "Uncomment the ones you'd like to use in this project."
fi
