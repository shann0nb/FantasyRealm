<template>
  <div id="app" class="container">
    <h3>Add dialog.</h3>
    <select v-model="currentCharacter">
      <option
        v-for="character in characters"
        v-bind:key="character.name"
        v-bind:value="character"
      >{{ character.name }}</option>
    </select>
    <img :src="currentCharacter.imgURL" height="40">
    <input v-model="textToGenerateSpeech" @keyup.enter="addDialog()">
    <button @click="addDialog()">Add</button>
    <br>
    <ul>
      <li v-for="(audioFile,index) in audioFiles" v-bind:key="audioFile.speech.url">
        <img :src="audioFile.imgURL" height="50">
        <button @click="playFile(audioFile.speech.url)">Play</button>
        <button @click="moveDialogFile(index, 1)">+</button>
        <button @click="moveDialogFile(index, -1)">-</button>
        <button @click="deleteDialog(index-1)">zap</button>
        <span>{{audioFile.dialog}}</span>
      </li>
    </ul>
    <button @click="playAll()">Play all</button>
    <hr>
    <h3>The characters in characters.json</h3>
    <ul>
      <li v-for="character in characters" v-bind:key="character.name">
        <img :src="character.imgURL" height="40">
        {{character.name}}
        (voiced by {{character.pollyVoice}} )
      </li>
    </ul>
  </div>
</template>

<script>
import { Predictions } from "aws-amplify";
import data from "./characters.json";
export default {
  name: "App",
  data() {
    return {
      textToGenerateSpeech: "Hello",
      audioFiles: [],
      currentCharacter: "",
      characters: []
    };
  },
  mounted: function() {
    this.characters = data.characters.slice();
    this.currentCharacter = this.characters[0];
    for (let index in this.characters) {
      if (!this.characters[index].pollyVoice) {
        this.characters[index].pollyVoice = "Amy";
        console.log("assigning Amy voice");
      } else {
        console.log("Using included voice", this.characters[index].pollyVoice);
      }
    }
  },
  methods: {
    async addDialog() {
      let result = await Predictions.convert({
        textToSpeech: {
          source: {
            text: this.textToGenerateSpeech
          },
          voiceId: this.currentCharacter.pollyVoice //"Amy" // default configured on aws-exports.js Johanna
        }
      });

      var audio = new Audio();
      audio.src = result.speech.url;
      //console.log(result)
      result.name = this.currentCharacter.name;
      result.imgURL = this.currentCharacter.imgURL;
      result.dialog = this.textToGenerateSpeech;

      this.audioFiles.push(result);
      audio.play();
    },
    async playFile(audioUrl) {
      var audio = new Audio();
      audio.src = audioUrl;
      audio.play();
    },
    deleteDialog: function(index) {
      alert("Won't it be cool when this works");
      this.audioFiles = this.audioFiles.splice(index, 1);
    },
    playAll: function() {
      let track = new Audio();

      let index = 1;
      //track.src=  this.dialogFiles[0].url;
      track.src = this.audioFiles[0].speech.url;
      track.play();
      let theDialogFiles = this.audioFiles;
      track.onended = function() {
        if (index < theDialogFiles.length) {
          track.src = theDialogFiles[index].speech.url;
          track.play();
          index++;
        }
      };
    },
    moveDialogFile: function(index, direction) {
      // Avoid moving outside of the list.
      if (
        (index > 0 && direction < 0) ||
        (index < this.audioFiles.length - 1 && direction > 0)
      ) {
        let x = index,
          y = index + direction; // move down if positive
        this.audioFiles[x] = this.audioFiles.splice(
          y,
          1,
          this.audioFiles[x]
        )[0];
      }
    }
  }
};
</script>

