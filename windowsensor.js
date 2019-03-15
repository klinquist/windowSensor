const values = {};
const showHeartBeat = true;
const showUnknownDevices = true;
const timeFormat = 'DD MMMM YYYY h:mm:ssA';
const stBaseUrl = 'https://graph.api.smartthings.com/api/smartapps/installations/xxxxx/';
const accessToken = '?access_token=xxxxx';
const request = require('request').defaults({json:true});

const motionSensorMappings = {
    'open': 'active',
    'closed': 'inactive'
};

const stMappings = {
    'open': 'open',
    'closed': 'close',
    'active': 'active',
    'inactive':'inactive'
};

const lookup = {
    '136835': {
        name: 'Office left window',
        stId: 'xxxx'
    },
    '671812': {
        name: 'Office right window',
        stId: 'xxxx'
    },
    '1023873': {
        name: 'Bedroom window',
        stId: 'xxxx'
    },
    '231809': {
        name: 'Front door',
        stId: 'xxxx'
    },
    '159772': {
        name: 'Kitchen motion sensor',
        mappings: motionSensorMappings,
        stId: 'xxxx'
    },
    '287609': {
        name: 'Hallway motion sensor',
        mappings: motionSensorMappings,
        stId: 'xxxx'
    },
    '353793': {
        name: 'Living room main left',
        stId: 'xxxx'
    },
    '925057': {
        name: 'Living room main right',
        stId: 'xxxx'
    },
    '579328': {
        name: 'Window by back door',
        stId: 'xxxx'
    },
    '578818': {
        name: 'Living room small left',
        stId: 'xxxx'
    },
    '235396': {
        name: 'Living room small right',
        stId: 'xxxx'
    },
    '586364': {
        name: 'Unknown?'
    }
};



var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
const moment = require('moment');
var Table = require('cli-table2');
const getNewTable = (header) => {
    const tableObj = {
        chars: {
            'top': '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            'bottom': '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            'left': ' ',
            'left-mid': '',
            'mid': '',
            'mid-mid': '',
            'right': '',
            'right-mid': '',
            'middle': ' '
        },
        colWidths: [30, 11, 11, 60, 20],
        wordWrap: false
    };
    if (header) {
        tableObj.head = ['Time', 'Channel', 'Device ID', 'Name', 'Status'];
    }
    return new Table(tableObj);

};


rl.on('line', (line) => {
    let sensorData;
    try {
        sensorData = JSON.parse(line);
    } catch (e) {

    }
    if (sensorData) {
        showSensorData(sensorData);
    } else {
        console.log('Unable to parse sensor data');
    }
});




const getTime = () => {
    return moment().format(timeFormat);
};

setTimeout(() => {
    console.log(getNewTable(true).toString());
},1000);

const showSensorData = (data) => {
    if (!data.id) {
        console.log('No data.id');
        return;
    }
    const table = getNewTable();
    if (!showHeartBeat && data.heartbeat == 'yes') {
        values[data.id] = data.state;
        return;
    }
    if (!showUnknownDevices && !lookup[data.id]) return;
    if (!values[data.id] || values[data.id] !== data.state) {
        table.push([
            getTime(), data.channel, data.id, lookup[data.id] && lookup[data.id].name, lookup[data.id] && lookup[data.id].mappings ? lookup[data.id].mappings[data.state] : data.state
        ]);
        console.log(table.toString());
        values[data.id] = data.state;
        if (lookup[data.id] && lookup[data.id].stId) {
            let cmd;
            if (lookup[data.id].mappings) {
                cmd = stMappings[lookup[data.id].mappings[data.state]];
            } else {
                cmd = stMappings[data.state];
            }
            const requestObj = {
                method: 'POST',
                uri: `${stBaseUrl}${lookup[data.id].stId}/command/${cmd}${accessToken}`
            };
            request(requestObj, (err, res, body) => {
                if (err) console.log(`Error reporting data to SmartThings: ${err}`);
                //console.log(body);
            });
        }
    }
};

