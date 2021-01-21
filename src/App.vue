<template>
  <div id="app">
    
    <table v-if="ape">
      <thead>
        <tr>
          <td v-for="c in columns" :key="c">{{ c }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in ape" :key="i.id" @click="item = Object.assign({},i)">
          <td v-for="c in columns" :key="`${i.id}-${c}`">{{ i[c] }}</td>
        </tr>
      </tbody>
    </table>
    <section v-if="item">
      <div class="cell">
        <input v-model="item.scEmail">
      </div>
    </section>
    <div id="map">qui ci va la mappa</div>
    <router-view />
  </div>
</template>
<script lang="ts" src="./App.ts"></script> 
<style lang="less">
@import url(./App.less);
</style>
