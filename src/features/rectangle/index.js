

const { findIntegers, computeStartPosition, computeTable, execCommands } = require('./rectangle.lib')

// define rectangle state
const state = {
    // current position
    position: null,

    // populate rectangle table 
    table: [],
    
    // defining current working step
    currentStep: 0,
}

const setState = (name, value) => {
    state[name] = value
}

const stepAction = async () => {
    switch (state.currentStep) {
        case 0:
            process.stdout.write('>> Define table size [x, y]: ')
            break
        case 1:
            process.stdout.write('>> Define start position [x, y]: ')
            break
        case 2:
            process.stdout.write('>> Choose next move [0, 1, 2, 3, 4]: ')
            break
        default:
            process.stdout.write('>>The end')
            process.exit()
    }
}

const help = () => {
    console.log('')
    console.log('> All inputs need to be comma separated unsigned 8-bit integers (0-255)')
    console.log('> use these commands to move around:')
    console.log('>>>>> 0 = quit')
    console.log('>>>>> 1 = forward')
    console.log('>>>>> 2 = backward')
    console.log('>>>>> 3 = rotate90')
    console.log('>>>>> 4 = rotate-90')
    console.log('')
    stepAction()
}

const inputHandler = async (input) => {
    // validator whether to move to next step or not
    let moveNext = false

    if (input == '--help\n' || input === '-h\n') {
        help()
        return
    }
    
    try {
        // validate user input and create integers array
        const integerList = await findIntegers(input)

        switch(state.currentStep) {
            // set table data
            case 0:
                const tableMatrix = await computeTable(integerList)
                setState('table', tableMatrix)
                moveNext = true
                break
            // set start position
            case 1:
                const pos = await computeStartPosition(integerList, state)
                setState('position', pos)
                moveNext = true
                break
            // exec list of commands and print result
            case 2:
                const newPosition = await execCommands(integerList, state)
                setState('position', newPosition)

                console.log(`>>>>>> CURRENT POSITION: `, newPosition)
                console.log('')
                process.stdout.write('stdout: ' + JSON.stringify(newPosition))
                console.log('')

                moveNext = false
                break
            default:
                break
        }
    } catch (err) {
        console.log(`>>>> ERROR: ${err.message}`)
        console.log('')
    }

    if (moveNext) {
        setState('currentStep', state.currentStep + 1)
    }

    // next action to take
    stepAction()
}

// start program
const start = () => {
    console.log('')
    console.log('> Hello ' + (process.env.USER || 'there') + '!')
    console.log('> In this program we will be moving around in a table matrix, yeeey!')
    console.log('> All inputs need to be comma separated unsigned 8-bit integers (0-255)')
    console.log('> follow the steps to get started, -h or --help if you need help')
    console.log('')

    // initiate first action
    stepAction()

    // handle user inputs
    process.stdin.on('data', async (input) => inputHandler(input))
}

module.exports = { start }
