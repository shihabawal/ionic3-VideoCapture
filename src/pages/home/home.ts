import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture'
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import 'whatwg-fetch'

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private data: MediaFile[];
  private display: any;
  private fileToUpload: Blob;

  constructor(public navCtrl: NavController, private mediaCapture: MediaCapture,
    private videoPlayer: StreamingMedia) {

  }

  ngAfterViewInit() {
    const firebaseConfig = {
      apiKey: "AIzaSyBBRp31BWk5ASh7bRW6pzoF6Vua4Mfs3OE",
      authDomain: "myproject1-9f93a.firebaseapp.com",
      databaseURL: "https://myproject1-9f93a.firebaseio.com",
      projectId: "myproject1-9f93a",
      storageBucket: "myproject1-9f93a.appspot.com",
      messagingSenderId: "718315834106"
    };

    firebase.initializeApp(firebaseConfig);
  }

  uploadVideo() {
    this.convertToBlob();

    let Ref = firebase.storage().ref('test/test1.mp4');
    let task = Ref.put(this.fileToUpload);

    task.on(firebase.storage.TaskEvent.STATE_CHANGED, 
    
      (snapshot:firebase.storage.UploadTaskSnapshot) => {
        this.display = 'Uploading: ' + ((snapshot.bytesTransferred/snapshot.totalBytes)*100).toFixed(2);
      },

      (err) => {
        alert(err);
      },

      () => {
        alert('Uploaded');
      }
    
    );
  }

  showVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'landscape'
    };
    this.videoPlayer.playVideo('file://' + this.data[0].fullPath, options);
  }

  convertToBlob() {
    let fileURL = this.data[0].fullPath;
    let fileName = this.data[0].name;

    fetch(this.data[0].fullPath).then(

      (res) => {
        res.blob().then(

          (value) => {
            this.fileToUpload = value;
          }

        )
      }

    );
  }

  captureVideo() {
    //alert('video');
    this.mediaCapture.captureVideo({ limit: 1 }).then( 
      (data: MediaFile[]) => {
        this.data = data;
        console.log(data[0]);
    }, (err: CaptureError) => {
      console.log(err);
    });
  }

}
