
export default class Generator2x2 {
    generate(length) {
        let allowedMoves = ['F', 'B', 'U', 'D', 'L', 'R']

        let scrambleMoves = []

        while(length--) {
            // select random move from allowed list:
            let selectedMove = allowedMoves[Math.floor(Math.random()*(allowedMoves.length))]
            scrambleMoves.push(selectedMove)
            
            allowedMoves = this._lock(selectedMove, allowedMoves)
            allowedMoves = this._unlock(selectedMove, allowedMoves)
            allowedMoves = this._removeDuplicates(allowedMoves)
        }

        let output = ""
        for(let move of scrambleMoves) {
            let random = Math.random()

            if(random > .66) {
                output += move + " "
            } else if(random > .33 ) {
                output += move + "2 "
            } else {
                output += move + "' "
            }
        }
        
        return output
    }

    _unlock(move, allowedMoves) {
        switch(move) {
            case 'F':
            case 'B':
                allowedMoves.push('U', 'D', 'L', 'R')
            break
                case 'U':
            case 'D':
                allowedMoves.push('F', 'B', 'L', 'R')
            break
                case 'L':
            case 'R':
                allowedMoves.push('U', 'D', 'F', 'B')
            break
        }

        return allowedMoves
    }

    _lock(move, allowedMoves) {
        for(let i = 0; i < allowedMoves.length; i++) {
            if(allowedMoves[i] === move) allowedMoves.splice(i, 1)
        }
        return allowedMoves
    }

    _removeDuplicates(allowedMoves) {
        let seenBefore = []
        for(let i = allowedMoves.length - 1; i >= 0; i--) {
            if(seenBefore.indexOf(allowedMoves[i]) > -1)
                allowedMoves.splice(i, 1)
            else
                seenBefore.push(allowedMoves[i])
        }
        return allowedMoves
    }
}