#! /usr/bin/env node
import chalk from 'chalk';
import fetch from 'node-fetch';
import moment from 'moment';

const [,, ... args]     = process.argv
const today             = moment();

// How many days forward.
const days              = parseInt(args[0]) > 0 ? parseInt(args[0]) : 7;

// Start date.
const startDate          = moment(args[1]).isValid() ? moment(args[1]) : today;
const endDate            = moment(startDate.clone()).add(days, 'days');

const url = new URL('https://statsapi.web.nhl.com/api/v1/schedule');

// Append start and end days into URL.
url.searchParams.append('startDate', startDate.format('YYYY-MM-DD'));
url.searchParams.append('endDate', endDate.format('YYYY-MM-DD'));

fetch(url, { method: "Get" })
    .then(res => res.json())
    .then((json) => {
        const teams = getGameCount(json);
        renderGameCount(teams);
    });

// Parse all games from given json.
const getGameCount = (json) => {

    if (json.totalGames === 0) { return []; }
    let teams = [];

    json.dates.forEach((date) => {
        date.games.forEach((game) => {

            ['away','home'].forEach((key) => {
                let found = false;
                for(let i = 0; i < teams.length; i++) {
                    if (teams[i].id === game.teams[key].team.id) {
                        found = true;
                        teams[i].games += 1;
                        break;
                    }
                }
                if (!found) {
                    game.teams[key].team.games = 1;
                    teams.push(game.teams[key].team);
                }
            })

        })
    });


    
    if (args[2] === 'name') {
        return teams.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }
    else {
        return teams.sort((a, b) => b.games - a.games);
    }

};

// Render game count results.
const renderGameCount = (teams) => {
    console.log(chalk.bgWhite(chalk.black(`Games between ${chalk.bold(startDate.format('D.M.'))} - ${chalk.bold(endDate.format('D.M.Y'))}`)))

    teams.forEach((team) => {
        console.log(`${team.name}: ${chalk.red(team.games)}`);
    });

};


// let days = 7;
//
// let url = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=2022-02-03&endDate=2022-03-10";
//
// let settings = { method: "Get" };
//


