<template>
    <g-chess-board
        id="chessBoard"
        fen="start"
        >
      <div
        v-for="marker in markers"
        :key="marker.class"
        :class="marker.class"
        :slot="marker.slot"
        ></div>
    </g-chess-board>
    <ion-button expand="full" @click="onNextPuzzle">Next Puzzle</ion-button>
    <ion-text color="white" id="result"><center>Take your turn</center></ion-text>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import 'gchessboard'
import { Chess } from 'chess.js'
import ChessService from '../services/ChessService'

const game = new Chess();
const markers: [{class: string, slot: string}] | any = ref()
const chessService = new ChessService();const onNextPuzzle = () => chessService.nextPuzzle()
    .then(fen => {
        const board = document.getElementById("chessBoard") as GChessBoardElement;
        board.fen = fen
        game.load(fen)
        board.interactive = true
        markers.value = null
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

        const resultElement = document.getElementById("result");
        if (resultElement != null) {
            const expectedMove = e.detail.from + e.detail.to
            if (expectedMove == chessService.bestMove) {
                console.log('success');
                resultElement.innerHTML = 'Correct move!';
                markers.value = [
                    { class: 'green-marker', slot: e.detail.from},
                    { class: 'green-marker', slot:  e.detail.to}
                ]
            } else {
                resultElement.innerHTML = 'Wrong move - ' + expectedMove + ' was expected.';
                
                markers.value = [
                    { class: 'green-marker', slot: chessService.bestMove.substring(0, 2)},
                    { class: 'green-marker', slot:  chessService.bestMove.substring(2)},
                    { class: 'red-marker', slot: e.detail.from},
                    { class: 'red-marker', slot:  e.detail.to}
                ]
            }
        } else {
            console.error("result element is null")
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

.red-marker {
  background-color: rgb(206, 52, 52);
  width: 100%;
  height: 100%;
}

.green-marker {
  background-color: rgb(32, 129, 32);
  width: 100%;
  height: 100%;
}
</style>