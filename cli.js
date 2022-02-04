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
        const games = parseGames(json);
        console.log(games);
    });


// Parse all games from given json.
const parseGames = (json) => {
    console.log(url.toString());
    console.log();
    console.log(endDate.format('YYYY-MM-DD'));
    console.log(`Total games between ${chalk.red(startDate.format('D.M.'))} - ${chalk.red(endDate.format('D.M.Y'))}: ${chalk.green(json.totalGames)}`)

};



// let days = 7;
//
// let url = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=2022-02-03&endDate=2022-03-10";
//
// let settings = { method: "Get" };
//


