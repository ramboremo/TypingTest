import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// --- IMPORTANT FOR STANDALONE COMPONENTS ---
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Define an interface for the shape of our Stat object for better type safety
interface Stat {
  date: string;
  wpm: number;
  accuracy: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink], // Import necessary modules
  providers: [DatePipe], // Add DatePipe to format dates in the template
  templateUrl: './stats.html',
  styleUrls: ['./stats.css']
})
export class Stats implements OnInit {
  // Properties to hold our data
  stats: Stat[] = [];
  isLoading = true;
  averageWpm = 0;
  averageAccuracy = 0;

  constructor(private http: HttpClient) {}

  // This function runs automatically when the component is first created
  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      console.error('No user email found. Cannot load stats.');
      this.isLoading = false;
      return;
    }

    // Call the backend API to get the stats for the logged-in user
    this.http.get<Stat[]>(`/api/stats/get/${email}`).subscribe({
      next: (data) => {
        this.stats = data;
        this.calculateAverages();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching stats:', err);
        this.isLoading = false;
      }
    });
  }

  private calculateAverages(): void {
    if (this.stats.length === 0) {
      return;
    }

    const totalWpm = this.stats.reduce((sum, stat) => sum + stat.wpm, 0);
    const totalAccuracy = this.stats.reduce((sum, stat) => sum + stat.accuracy, 0);

    this.averageWpm = totalWpm / this.stats.length;
    this.averageAccuracy = totalAccuracy / this.stats.length;
  }
}
