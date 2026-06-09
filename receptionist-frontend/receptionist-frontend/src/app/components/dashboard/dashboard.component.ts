import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { VoiceAgentService } from '../../services/voice-agent.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
    userProfile: any;
    loading = true;
    
    isAgentConnected = false;
    isAgentSpeaking = false;

    constructor(
        private userService: UserService, 
        private voiceAgentService: VoiceAgentService,
        private router: Router
    ) { }

    ngOnInit() {
        this.userService.getUserProfile().subscribe({
            next: (data) => {
                this.userProfile = data;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                // if unauthorized, maybe redirect
            }
        });

        this.voiceAgentService.isConnected$.subscribe(connected => {
            this.isAgentConnected = connected;
        });

        this.voiceAgentService.isAgentSpeaking$.subscribe(speaking => {
            this.isAgentSpeaking = speaking;
        });

        this.voiceAgentService.error$.subscribe(error => {
            alert(error);
        });
    }

    ngOnDestroy() {
        this.voiceAgentService.disconnect();
    }

    toggleVoiceAgent() {
        if (this.isAgentConnected) {
            this.voiceAgentService.disconnect();
        } else {
            // Adjust the URL if the backend runs on a different port/host
            this.voiceAgentService.connectAndStart('ws://localhost:8002/ws');
        }
    }

    deleteProfile() {
        if (confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
            this.userService.deleteProfile().subscribe({
                next: () => {
                    alert("Profile deleted successfully.");
                },
                error: (err) => {
                    alert("Failed to delete profile.");
                }
            });
        }
    }

    logout() {
        this.userService.logout();
    }
}
