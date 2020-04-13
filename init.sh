#!/bin/sh
env
npm i -g @microsoft/rush
rush prune
rush install
rush update
rush build
rush watch