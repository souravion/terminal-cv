import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  whoamiData,
  skillsData,
  projectsData,
  experienceData,
  achievementsData,
  githubData,
  contactData,
  helpCommandsData
} from './data';


@Component({
  selector: 'app-terminal',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './terminal.html',
  styleUrls: ['./terminal.scss'], // Correct Angular property for multiple style files
})
export class Terminal implements OnInit, AfterViewInit {
  // Stores the current input typed by the user
  currentCommand = '';

  // Stores all previous terminal outputs and commands
  terminalHistory: string[] = [];

  // Keep the welcome messages separate
  initialMessages: string[] = [
    `<span class="success">Welcome to Sr.Software Engineer Terminal v2.1.0</span>`,
    `<span class="comment">Type 'help' to see available commands.</span>`,
    ''
  ];

  // Flag to indicate if the terminal is currently "typing" output (used for animation)
  isTyping = false;


  // References to DOM elements using Angular ViewChild
  @ViewChild('terminalInput') terminalInput!: ElementRef<HTMLInputElement>;
  @ViewChild('terminalBody') terminalBody!: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2, private ngZone: NgZone) {}

  /**
   * Angular lifecycle hook - ngOnInit
   * Initializes the terminal with a welcome message
   */
  ngOnInit() {
    this.terminalHistory.push(
      `<span class="success">Welcome to Sr.Software Engineer Terminal v2.1.0</span>`,
      `<span class="comment">Type 'help' to see available commands.</span>`,
      ''
    );
  }

  /**
   * Angular lifecycle hook - ngAfterViewInit
   * Focus the terminal input after view has been initialized
   */
  ngAfterViewInit() {
    this.focusInput();
  }

  /**
   * Focuses the terminal input field
   */
  private focusInput() {
  this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
      this.terminalInput?.nativeElement?.focus();
    }, 0);
  });
}


  /**
   * Scrolls the terminal body to the bottom to show the latest output
   */
  private scrollToBottom() {
    if (this.terminalBody?.nativeElement) {
      this.terminalBody.nativeElement.scrollTop = this.terminalBody.nativeElement.scrollHeight;
    }
  }

  /**
   * Handles keyboard events for the input field
   * @param event - KeyboardEvent triggered on key press
   */
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.executeCommand(); // Execute command on Enter key
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      // TODO: Implement command history navigation using Arrow keys
    }
  }

  /**
   * Executes the typed command
   */
  executeCommand() {
    if (!this.currentCommand.trim()) return; // Ignore empty commands

    const command = this.currentCommand.trim().toLowerCase();

    // Add the typed command to terminal history with a prompt
    this.terminalHistory.push(
      `<span class="prompt">sourav@portfolio:~$</span> <span class="command">${this.currentCommand}</span>`
    );

    if (this.commands[command]) {
      // If the command exists, simulate typing animation
      this.isTyping = true;

      setTimeout(() => {
        // Execute the command function and add its output to history
        const output = this.commands[command]();
        output.forEach((line: any) => this.terminalHistory.push(line));

        this.isTyping = false; // Stop typing animation
        this.currentCommand = ''; // Clear input field

        // Refocus input and scroll terminal to bottom
        this.focusInput();
        this.scrollToBottom();
      }, 800); // 800ms delay to simulate typing
    } else {
      // Handle unknown commands
      this.terminalHistory.push(
        `<span class="error">Command not found: ${command}</span>`,
        `<span class="comment">Type 'help' to see available commands.</span>`,
        ''
      );
      this.currentCommand = '';
      this.focusInput();
      this.scrollToBottom();
    }
  }



  /**
   * Object storing all available terminal commands and their implementations
   */
  commands: any = {
    // 'help' command lists all available commands
    help: () => {
      const output = ['<span class="success">Available Commands:</span>', ''];
      helpCommandsData.forEach(cmd => {
        output.push(`<span class="command">${cmd.command}</span>        - ${cmd.description}`);
      });
      output.push('');
      return output;
    },

    // 'whoami' command displays developer information
    whoami: () => whoamiData,

    // 'skills' command displays frontend and additional skills
    skills: () => {
      const frontendSkills = skillsData.frontend.map(
        s =>
          `   ${s.name} <span class="skill-bar"><span class="skill-progress" style="--progress-width: ${s.width}"></span></span> ${s.level}`
      );
      const additionalSkills = skillsData.additional.map(s => `   ${s}`);
      return [
        '<span class="comment">Loading technical skills...</span>',
        '',
        '🚀 <span class="tech-stack">Frontend Technologies:</span>',
        ...frontendSkills,
        '',
        '⚡ <span class="tech-stack">Additional Skills:</span>',
        ...additionalSkills,
        '',
      ];
    },

    // 'projects' command lists recent projects with highlights
    projects: () => {
      const output = ['<span class="comment">Recent Projects:</span>', ''];
      projectsData.forEach(p => {
        output.push(`${p.icon} <span class="project-name">${p.name}</span>`);
        output.push(`   ${p.description}`);
        p.highlights.forEach(h => output.push(`   • ${h}`));
        output.push('');
      });
      return output;
    },

    // 'experience' command lists professional experiences
    experience: () => {
      const output = ['<span class="highlight">Professional Experience:</span>', ''];
      experienceData.forEach(exp => {
        output.push(`🏢 <span class="tech-stack">${exp.role} | ${exp.company}</span> | ${exp.period}`);
        exp.highlights.forEach(h => output.push(`   • ${h}`));
        output.push('');
      });
      return output;
    },

    // 'achievements' command lists career highlights
    achievements: () => {
      const output = ['<span class="comment">Career Highlights:</span>', ''];
      achievementsData.forEach(a => {
        output.push(`${a.icon} <span class="achievement">${a.title}</span>`);
        a.highlights.forEach(h => output.push(`   • ${h}`));
        output.push('');
      });
      return output;
    },

    // 'github' command shows contributions and repositories stats
    github: () => {
      const output = ['<span class="comment">GitHub Statistics:</span>', ''];
      output.push('📊 Contributions:');
      githubData.contributions.forEach(c => output.push(`   • <span class="github-stats">${c.value}</span> ${c.label}`));
      output.push('');
      output.push('⭐ Repositories:');
      githubData.repositories.forEach(r => output.push(`   • <span class="github-stats">${r.value}</span> ${r.label}`));
      output.push('');
      return output;
    },

    // 'contact' command shows work availability and portfolio link
    contact: () => {
      const output = [`<span class="success">${contactData.message}</span>`, ''];
      output.push('🔗 <span class="highlight">Available for:</span>');
      contactData.availableFor.forEach(item => output.push(`   • ${item}`));
      output.push('');
      output.push('💼 <span class="highlight">Work Preferences:</span>');
      contactData.workPreferences.forEach(item => output.push(`   • ${item}`));
      output.push('');
      output.push(`🌟 <span class="tech-stack">${contactData.closing}</span>`);
      output.push(
        `🌐 <span class="highlight">${contactData.portfolio.label}:</span> <a href="${contactData.portfolio.url}" target="_blank">${contactData.portfolio.url}</a>`
      );
      output.push('');
      return output;
    },

    // 'clear' command clears the terminal screen
    clear: () => {
      this.terminalHistory = [...this.initialMessages]; // keep welcome text
      return [];
},

  };
}
