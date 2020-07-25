#!/bin/sh

tmux new-session -d -s "registrum-dev"
tmux send-keys "cd projects/api" C-m "clear" C-m "npm run start" C-m

tmux split-window -v
tmux send-keys "cd projects/banner" C-m "clear" C-m "npm run start" C-m

tmux -2 attach-session -t "registrum-dev"