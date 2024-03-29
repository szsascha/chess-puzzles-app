export default class ChessService {

    private _positions: Array<string> = []

    private _stockfish: Worker = new Worker('assets/js/stockfish-nnue-16-single.js')

    private _currentPosition = 'start'

    private _bestMove = ''

    private _readyToSolvePuzzle = false

    constructor() {
        fetch("puzzles.fen")
            .then((res) => res.text())
            .then((text) => this._positions = text.split('\n'))
            .catch((e) => console.error(e));

        this._stockfish.postMessage("uci")
        this._stockfish.postMessage("isready")
    }

    nextPuzzle(): Promise<string> {
        this._readyToSolvePuzzle = false
        this._currentPosition = this._positions[Math.floor(Math.random()*this._positions.length)]
            + ' w - - 0 1'; // Setting fix parameters as a workaround due to bad dataset.

        this._stockfish.onmessage = (event) => {
            console.log(event.data);
            if (event.data.startsWith('bestmove')) {
                const splittedEvent = event.data.split(' ')
                this._bestMove = splittedEvent[1]
                this._readyToSolvePuzzle = true
                console.log('move ' + this._bestMove)
            }
        };

        this._stockfish.postMessage("ucinewgame")
        this._stockfish.postMessage("position fen " + this._currentPosition)
        this._stockfish.postMessage("go depth 15")

        return new Promise<string>((resolve) => {
            const checkIfReadyToSolve = () => {
                if (this._readyToSolvePuzzle) {
                    this._stockfish.postMessage("stop")
                    resolve(this._currentPosition);
                } else {
                    setTimeout(checkIfReadyToSolve, 100); // Check every 100 milliseconds
                }
            };
            checkIfReadyToSolve();
        });
    }

    get bestMove(): string {
        return this._bestMove;
    }

}