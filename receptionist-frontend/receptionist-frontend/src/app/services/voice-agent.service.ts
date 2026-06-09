import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoiceAgentService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;

  public isConnected$ = new BehaviorSubject<boolean>(false);
  public isAgentSpeaking$ = new BehaviorSubject<boolean>(false);
  public error$ = new Subject<string>();

  constructor(private zone: NgZone) {}

  public async connectAndStart(wsUrl: string) {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      this.ws = new WebSocket(wsUrl);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        this.zone.run(() => {
          this.isConnected$.next(true);
        });
        this.startMicrophoneStream();
      };

      this.ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          this.playAudioChunk(event.data);
        } else if (typeof event.data === 'string') {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'bot_started_speaking') {
              this.zone.run(() => this.isAgentSpeaking$.next(true));
            } else if (msg.type === 'bot_stopped_speaking') {
              this.zone.run(() => this.isAgentSpeaking$.next(false));
            }
          } catch (e) {
            // Ignored
          }
        }
      };

      this.ws.onclose = () => {
        this.disconnect();
      };

      this.ws.onerror = (error) => {
        this.zone.run(() => this.error$.next('WebSocket error occurred'));
        this.disconnect();
      };
    } catch (err) {
      console.error('Failed to start voice agent', err);
      this.error$.next('Could not access microphone');
    }
  }

  private startMicrophoneStream() {
    if (!this.audioContext || !this.mediaStream || !this.ws) return;

    this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.mediaStream);
    
    // Using ScriptProcessorNode for wide browser compatibility with 16kHz PCM
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    
    this.processor.onaudioprocess = (e) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Convert Float32Array to Int16Array
        const int16Data = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          let s = Math.max(-1, Math.min(1, inputData[i]));
          int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        this.ws.send(int16Data.buffer);
      }
    };

    this.mediaStreamSource.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  private playAudioChunk(arrayBuffer: ArrayBuffer) {
    if (!this.audioContext) return;

    // Convert Int16Array to Float32Array
    const int16Data = new Int16Array(arrayBuffer);
    const float32Data = new Float32Array(int16Data.length);
    for (let i = 0; i < int16Data.length; i++) {
      float32Data[i] = int16Data[i] / 32768.0;
    }

    const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, 16000);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  public disconnect() {
    this.zone.run(() => {
      this.isConnected$.next(false);
      this.isAgentSpeaking$.next(false);
    });

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
