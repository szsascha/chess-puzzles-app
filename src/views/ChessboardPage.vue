<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Chessboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Chessboard</ion-title>
        </ion-toolbar>
      </ion-header>

      <ChessBoard />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ChessBoard from '@/components/ChessBoard.vue';
</script>
