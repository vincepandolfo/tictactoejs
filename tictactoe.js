function TicTacToe(player) {
    var game = this;
    var fullBoard = 511;

    this.player = player;
    this.agent = (player === "X") ? "O" : "X";

    // state is saved as two integers.
    // the first 9 bits from the right are used to store if 
    // there is a symbol in the corresponding cell
    this.state = {
        X: 0,
        O: 0
    };

    // to speed things up for the MiniMax algo the outcome for every
    // state is saved in a memo table 2x512x512 (9 bits for each symbol)
    // | 0 | 1 | 2 |
    // | 3 | 4 | 5 |
    // | 6 | 7 | 8 |
    var memo = {
        X: [],
        O: []
    };
    // init the 2D array
    for (var i = 0; i < 512; i++) {
        memo.X.push([]);
        memo.O.push([]);
    }

    // used to check if player move is a valid one
    var isValid = function(cell) {
        if((game.state.X & (1 << cell)) || (game.state.O & (1 << cell)))
            return false;

        return true;
    };

    // executes the player move. Returns tree if successful, else false
    this.setPlayerAction = function(cell) {
        // turns on the bit corresponding to the clicked cell
        if(!isValid(cell)) return false;

        this.state[this.player] |= (1 << cell);
        return true;
    };

    // executes the MiniMax algorithm to find the AI next move
    this.getAgentAction = function() {
        var agentAction = miniMax(this.state, this.agent).action;
        this.state[this.agent] |= (1 << agentAction);
        return agentAction;
    };

    var miniMax = function(state, who) {
        // if the state has been visited already, return its value
        if(memo[who][state.X][state.O] !== undefined)
            return memo[who][state.X][state.O];

        var winner = game.whoIsWinning(state);

        // if someone is winning, or the board is full, return.
        if (winner === -1 || winner === 1 || state.X + state.O === fullBoard) {
            memo[who][state.X][state.O] = { action: null, value: winner };
            return memo[who][state.X][state.O];
        }

        if (who === game.agent) { // calls the max function 
            memo[who][state.X][state.O] = max(state);
            return memo[who][state.X][state.O];
        }
        else { // calls the mini function
            memo[who][state.X][state.O] = mini(state);
            return memo[who][state.X][state.O];
        }
    };

    // returns true if the board is full
    this.isFull = function () {
        return this.state.X + this.state.O === fullBoard;
    };

    var cases = [
        parseInt('111000000', 2), // top row
        parseInt('000111000', 2), // middle row
        parseInt('000000111', 2), // bottom row
        parseInt('100100100', 2), // right row
        parseInt('010010010', 2), // middle column
        parseInt('001001001', 2), // left column
        parseInt('100010001', 2), // diagonal 1
        parseInt('001010100', 2)  // diagonal 2
    ];

    // returns 1 if the agent wins in this state,
    // -1 if the player wins, 0 otherwise
    this.whoIsWinning = function(state) {
        // if not defined, state is current game state
        if(state === undefined) state = this.state;

        // iterates through all the possible cases
        for(var i = 0; i < cases.length; i++) {
            if((state[this.agent] & cases[i]) === cases[i]) return 1;
            if((state[this.player] & cases[i]) === cases[i]) return -1;
        }

        return 0;
    };

    max = function(state) {
        var best = {
            action: null,
            value: -1
        };

        for(var i = 0; i < 9; i++) {
            // checks if action is possible
            if(!(state[game.player] & (1 << i)) && !(state[game.agent] & (1 << i))) {
                var newState = JSON.parse(JSON.stringify(state)); // clones the state
                newState[game.agent] |= (1 << i);
                var value = miniMax(newState, game.player).value;

                if(value > best.value) {
                    best.action = i;
                    best.value = value;
                }
            }
        }

        return best;
    };

    mini = function(state) {
        var best = {
            action: null,
            value: 1
        };

        for(var i = 0; i < 9; i++) {
            // checks if action is possible
            if((state[game.player] & (1 << i)) === 0 && (state[game.agent] & (1 << i)) === 0) {
                var newState = JSON.parse(JSON.stringify(state)); // clones the state
                newState[game.player] |= (1 << i);
                var value = miniMax(newState, game.agent).value;

                if(value < best.value) {
                    best.action = i;
                    best.value = value;
                }
            }
        }

        return best;
    };
}
