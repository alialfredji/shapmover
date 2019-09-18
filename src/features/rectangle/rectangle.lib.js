
// clean input and return list of integers
const findIntegers = (input) => {
    input = input.replace(/\n/g, '')
    input = input.replace(/ /g, '')
    input = input.split(',')
    
    let output = []
    input.forEach(item => {
        const int = parseInt(item, 10)
        if (isNaN(int)) throw new Error(`[${item}] not an integer`)
        if (int > 255 || int < 0) throw new Error(`[${int}] integer to big, require 0-255`)
        output.push(int)
    })
    
    return output
}
    
// validate input and compute table matrix
const computeTable = (integerList) => {
    // check if inputted height and width is correct
    const tbWidth = integerList[0]
    const tbHeight = integerList[1]
    
    if ([null, undefined].indexOf(tbWidth) !== -1) {
        throw new Error('Missing width')
    }
    
    if ([null, undefined].indexOf(tbHeight) !== -1) {
        throw new Error('Missing height')
    }
    
    // build table matrix
    const output = []
    for(let i = 0; i < tbHeight; i++) {
        const tmp = []
        for (let i2 = 0; i2 < tbWidth; i2++) {
            tmp.push([i2,i])
        }
        
        if (!tmp.length) return
        output.push(tmp)
    }

    // require user to define a table
    if (!output.length) {
        throw new Error('Table is empty')
    }
    
    return output
}

const computeStartPosition = (integerList, state) => {
    // check if inputted x and y is correct
    const x = integerList[0]
    const y = integerList[1]

    if ([null, undefined].indexOf(x) !== -1) {
        throw new Error('Missing position x')
    }

    if ([null, undefined].indexOf(y) !== -1) {
        throw new Error('Missing position y')
    }

    // validate if position is out of range
    if (!state.table[y] || !state.table[y][x]) {
        throw new Error('position not in table')
    }

    return [x,y]
}

// move position based on commands
const execCommands = (integerList, state) => {
    const directions = [
        [ 0, -1 ], // north
        [ 1, 0 ], // east
        [ 0, 1 ], // south
        [ -1, 0 ], // west
    ]

    let dirr = 0 // defined direction index
    let position = state.position // current position in [x, y]

    console.log('')
    console.log('>>>>>> starting direction: north')
    integerList.forEach(int => {
        switch (int) {
            // quit simulation and print results to ​stout
            case 0:
                console.log(`>>>>>> CURRENT POSITION: `, position)
                console.log('')
                process.stdout.write('stdout: ' + JSON.stringify(position))
                console.log('')
                process.exit()
                break
            // move forward one step
            case 1:
                position = [ position[0] + directions[dirr][0], position[1] + directions[dirr][1] ]
                console.log('>>>>>> moving forward to position: ', position)
                break
            // move backward one step
            case 2:
                position = [ position[0] - directions[dirr][0], position[1] - directions[dirr][1] ]
                console.log('>>>>>> moving backward to position: ', position)
                break
            // rotate clockwise 90 degrees 
            case 3:
                if (directions.length - 1 === dirr) {
                    dirr = 0
                } else {
                    dirr = dirr + 1
                }
                console.log('>>>>>> changing direction clockwise 90 degrees')
                break
            // rotate counterclockwise 90 degrees
            case 4:
                if (dirr === 0) {
                    dirr = directions.length - 1
                } else {
                    dirr = dirr - 1
                }
                console.log('>>>>>> changing direction counterclockwise 90 degrees')
                break
            // skip unknown steps
            default:
                break
        }

        // if position move is out of range, then exit exection
        if (!state.table[position[1]] || !state.table[position[1]][position[0]]) {
            console.log('')
            process.stdout.write('stdout: ' + JSON.stringify([-1,-1]))
            console.log('')
            throw new Error(`Position out of range [ ${position} ]`)
        }
    })

    return position
}

module.exports = {
    findIntegers,
    computeStartPosition,
    computeTable,
    execCommands
}