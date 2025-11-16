import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Define the structure for each character in our sentence array
interface Character {
  char: string;
  class: 'untyped' | 'correct' | 'incorrect';
}

type Difficulty = 'beginner' | 'intermediate' | 'pro';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.css']
})
export class MainPage implements OnInit {
  @ViewChild('hiddenInput') hiddenInput!: ElementRef<HTMLInputElement>;

  // --- Properties for the template ---
  sentenceArray: Character[] = [];
  testInProgress = false;
  timer = 0;
  results = {
    wpm: null as number | null,
    accuracy: null as number | null,
  };
  currentIndex = 0;
  difficulty: Difficulty = 'intermediate'; // Default difficulty

  // --- Private properties for the logic ---
  private readonly sentences: Record<Difficulty, string[]> = {
  beginner: [
    "The small cat sat quietly on the soft mat near the window.",
    "I like to read interesting books every evening before I go to sleep.",
    "She runs very fast every morning in the park with her friends.",
    "We eat fresh red apples daily because they are tasty and healthy.",
    "Beautiful birds fly high in the blue sky on a bright sunny day.",
    "He plays happily with a colorful ball in the garden after school.",
    "The bright sun is very hot today, and everyone is looking for shade.",
    "My cute dog is happy when I give him food and take him for a walk.",
    "It is a big green tree that gives cool shade and many sweet fruits.",
    "They drink clean cold water now because they were feeling very thirsty.",
    "My fluffy rabbit gets excited when I bring him carrots and let him hop around."
  ],

  intermediate: [
    "The quick brown fox swiftly jumps over the lazy dog, showing its playful energy and agility.",
    "Never underestimate the power of a good book to inspire new thoughts and change your perspective on life.",
    "Technology has completely revolutionized how we live, work, and connect with people across the world efficiently.",
    "The journey of a thousand miles always begins with a single step forward, reminding us that progress starts small.",
    "Creativity is intelligence having fun in unexpected ways, turning ordinary ideas into something extraordinary.",
    "Success is not final, and failure is not fatal; what truly matters is the courage to continue moving forward.",
    "In the middle of great difficulty often lies an even greater opportunity waiting to be discovered.",
    "The beautiful sunset painted the evening sky with shades of orange, pink, and gold that took everyone’s breath away.",
    "A warm cup of coffee in the morning can make all the difference, giving energy and comfort to start the day right.",
    "Learning a new language opens up a world of possibilities, from meeting new people to understanding different cultures.",
    "The gentle rain tapped softly against the windowpane, creating a peaceful sound that calmed the entire room.",
    "Honesty is the first chapter in the book of wisdom, always guiding us toward truth and strong character.",
    "A friendly smile can instantly brighten someone's entire day and make the world feel a little kinder.",
    "The majestic mountains stood tall against the clear blue sky, a reminder of nature’s power and beauty.",
    "Music has the power to heal the heart, lift the spirit, and truly inspire the soul in countless ways.",
    "Patience is a virtue essential for long-term success, teaching us to stay calm and focused even through challenges.",
    "The scent of freshly baked bread filled the entire house, bringing warmth and comfort to everyone inside.",
    "Exploring the vast universe requires immense curiosity, courage, and the desire to understand the unknown.",
    "A well-organized bookshelf reflects a tidy and thoughtful mind that values knowledge and clarity.",
    "Understanding complex algorithms is crucial for development, as they form the foundation of efficient computing."
  ],

  pro: [
    "The notoriously capricious nature of advanced quantum mechanics often bewilders even seasoned physicists, necessitating a profound rethinking of conventional paradigms.",
    "Interdisciplinary collaboration among diverse scientific disciplines is indispensable for tackling multifaceted global challenges, such as climate change and pandemic preparedness.",
    "Exacerbating the predicament, the intricate bureaucratic mechanisms frequently impede streamlined operational workflows, frustrating conscientious administrators.",
    "Notwithstanding prevailing economic uncertainties, consistent infrastructural investments are fundamentally paramount for fostering sustainable long-term prosperity across nascent economies.",
    "The quintessential characteristic distinguishing exceptional craftsmanship from mere competency invariably resides in an unwavering attention to meticulous, infinitesimal details.",
    "Conscientious cryptographic implementations are absolutely imperative for safeguarding sensitive governmental communications from increasingly sophisticated cyber-espionage activities.",
    "Philanthropic initiatives, meticulously orchestrated to empower underprivileged communities, demonstrably contribute to the amelioration of systemic socio-economic disparities.",
    "Deconstructing the multifaceted implications of post-modern philosophical discourse demands an exhaustive engagement with its inherent epistemological and ontological ambiguities.",
    "The inexorable march of artificial intelligence necessitates a comprehensive ethical framework to navigate the unprecedented socio-cultural transformations it portends for humanity.",
    "Unflappable perseverance, coupled with an unwavering commitment to empirical validation, remains the bedrock of groundbreaking scientific discovery and technological innovation."
  ]
};


  private currentSentence = '';
  private startTime: Date | null = null;
  private timerInterval: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.currentSentence = 'Click a difficulty mode and then Start to begin your test!';
    this.prepareSentence(this.currentSentence);
  }

  setDifficulty(newDifficulty: Difficulty): void {
    if (!this.testInProgress) {
      this.difficulty = newDifficulty;
      this.currentSentence = `Difficulty set to ${newDifficulty}. Click Start to begin!`;
      this.prepareSentence(this.currentSentence);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.testInProgress) return;

    if (event.key === ' ' || event.key === 'Backspace') {
      event.preventDefault();
    }
    
    if (event.ctrlKey || event.altKey || event.metaKey || event.key.length > 1 && event.key !== 'Backspace') {
      return;
    }

    if (event.key === 'Backspace') {
      this.handleBackspace();
    } else {
      event.preventDefault(); 
      this.handleCharacter(event.key);
    }
  }

  startTest() {
    this.testInProgress = true;
    this.results = { wpm: null, accuracy: null };
    this.currentIndex = 0;
    this.timer = 0;
    
    if (this.timerInterval) {
        clearInterval(this.timerInterval);
    }

    // Select a sentence based on the current difficulty
    const sentencesForDifficulty = this.sentences[this.difficulty];
    this.currentSentence = sentencesForDifficulty[Math.floor(Math.random() * sentencesForDifficulty.length)];
    this.prepareSentence(this.currentSentence);
    
    this.focusHiddenInput();
    this.startTime = new Date();
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }

  private handleCharacter(typedChar: string) {
    if (this.currentIndex >= this.sentenceArray.length) return;

    const currentCharacter = this.sentenceArray[this.currentIndex];
    currentCharacter.class = typedChar === currentCharacter.char ? 'correct' : 'incorrect';
    
    this.currentIndex++;

    if (this.currentIndex >= this.sentenceArray.length) {
      this.testComplete();
    }
  }

  private handleBackspace() {
    if (this.currentIndex === 0) return;

    this.currentIndex--;
    this.sentenceArray[this.currentIndex].class = 'untyped';
  }

  private testComplete() {
    clearInterval(this.timerInterval);
    this.testInProgress = false;

    if (!this.startTime) return;
    const endTime = new Date();
    const elapsedTime = (endTime.getTime() - this.startTime.getTime()) / 1000;

    const correctChars = this.sentenceArray.filter(c => c.class === 'correct').length;
    const wordsTyped = correctChars / 5; // Standard WPM calculation

    const wpm = Math.round((wordsTyped / elapsedTime) * 60) || 0;
    const accuracy = Math.round((correctChars / this.currentSentence.length) * 100) || 0;

    this.results = { wpm, accuracy };
    this.saveStats(wpm, accuracy);
    this.currentSentence = "Test complete! Click 'Start Again' to retry, or change difficulty.";
    this.prepareSentence(this.currentSentence);
  }

  private updateTimer() {
    if (!this.startTime) return;
    const now = new Date();
    this.timer = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
  }

  private prepareSentence(sentence: string) {
    this.sentenceArray = sentence.split('').map(char => ({ char, class: 'untyped' }));
  }

  focusHiddenInput() {
    setTimeout(() => {
        this.hiddenInput.nativeElement.focus();
    }, 0);
  }

  onInput(event: Event) {
    if (!this.testInProgress || (event as InputEvent).isComposing) return;
    
    const inputEvent = event as InputEvent;
    const inputElement = event.target as HTMLInputElement;

    if (inputEvent.inputType === 'deleteContentBackward') {
        this.handleBackspace();
        inputElement.value = ''; 
        return;
    }

    const typedValue = inputEvent.data || '';
    if (typedValue) {
        for (const char of typedValue) {
            this.handleCharacter(char);
        }
    }

    inputElement.value = '';
  }
  
  private saveStats(wpm: number, accuracy: number) {
    const email = localStorage.getItem('userEmail'); 
    if (email) {
      this.http.post('/api/stats/save', { email, wpm, accuracy }).subscribe({
        next: (res) => console.log('Stat saved successfully', res),
        error: (err) => console.error('Error saving stat', err)
      });
    } else {
        console.warn('No user email found in localStorage. Stat not saved.');
    }
  }
}