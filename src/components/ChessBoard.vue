<template>
    <g-chess-board
        id="chessBoard"
        fen="start"
        >
    </g-chess-board>
    <ion-button expand="full" @click="onNextPuzzle">Next Puzzle</ion-button>
    <ion-text color="white" id="result"><center>Take your turn</center></ion-text>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import 'gchessboard'
import { Chess } from 'chess.js'
import ChessService from '../services/ChessService'

const game = new Chess();
const chessService = new ChessService();const onNextPuzzle = () => chessService.nextPuzzle()
    .then(fen => {
        const board = document.getElementById("chessBoard") as GChessBoardElement;
        board.fen = fen
        game.load(fen)
        board.interactive = true
    })
    .catch(error => console.error("Error fetching puzzle:", error))

onMounted(() => {
    const board = document.getElementById("chessBoard") as GChessBoardElement;

    board.addEventListener("movestart", (e: any) => {
        console.log(`Move started: ${e.detail.from}, ${e.detail.piece.color} ${e.detail.piece.pieceType}`);
        e.detail.setTargets(
            game.moves({ square: e.detail.from, verbose: true }).map((m) => m.to)
        );
    });

    board.addEventListener("moveend", (e: any) => {
        console.log(`Move ending: ${e.detail.from} -> ${e.detail.to}, ${
            e.detail.piece.color
        } ${e.detail.piece.pieceType}`);

        const move = game.move({
            from: e.detail.from,
            to: e.detail.to
        });
        if (move === null) {
            e.preventDefault();
        }

        if (e.detail.from + e.detail.to == chessService.bestMove) {
            console.log('success');
            document.getElementById("result").innerHTML = '<center>Correct move!</center>';
        } else {
            document.getElementById("result").innerHTML = '<center>Wrong move</center>';
        }

        board.interactive = false
    });
});
</script>
  
<style scoped>
g-chess-board {
    margin: auto;
    max-width: 500px;
}

ion-button {
    margin: auto;
    max-width: 500px;
    --background: #4c9469;
}
</style>