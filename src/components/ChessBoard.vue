<template>
    <g-chess-board 
        fen="start"
        interactive="true"
        >
    </g-chess-board>
</template>
  
<script setup lang="ts">
import "gchessboard";
</script>
  
<style scoped>
g-chess-board {
    margin: auto;
    max-width: 500px;
}
</style>