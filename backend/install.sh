if [ ${ENV} == "DEV"]; then
    FROM arm32v7/node:16-buster
else
    FROM node:16