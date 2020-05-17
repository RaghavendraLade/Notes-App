import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    __list = [];
    list = [];
    notes: any;
    searchKey = '';
    toggle = false;
    
    @ViewChild('workspace') workspace: ElementRef;

    constructor() {}

    ngOnInit() {
        this.__list = this.getStorageData();
        this.list = [...this.__list];
        this.notes = this.__list[0];
    }

    openInNoteArea(notes) {
        if (!this.notes.text || !this.notes.dirty) {
            this.delete(notes);
            return;
        }
        this.notes = notes;
    }

    search(event) {
        this.list = this.__list.filter((note) => {
            return note.text.includes(event);
        });
    }

    toggleSidebar() {
        this.toggle = !this.toggle;
    }

    noteChange(note) {
        this.notes.dirty = true;
        this.notes.updatedTime = (new Date()).getTime();
        const index = this.list.findIndex((note) => {
            return note.id === this.notes.id;
        });

        const takeout = this.__list.splice(index, 1);

        this.__list.unshift(takeout[0]);
        this.search(this.searchKey);
        this.setStorageData(this.__list);
    }

    delete(note?: any) {
        const index = this.__list.findIndex((note) => {
            return note.id === this.notes.id;
        });

        this.__list.splice(index, 1);

        if (!this.__list.length) {
            this.__list.push({ id: 1, text: '', updatedTime: (new Date().getTime()), dirty: false});
        }

        this.search(this.searchKey);
        this.notes = note ? note : this.list[0];
        this.setStorageData(this.__list);
    }

    create() {
        this.searchKey = '';
        this.search('');
        if (!this.notes.text || !this.notes.dirty) {
            this.workspace.nativeElement.focus();
            return;
        }
        this.__list.unshift({ id: this.__list[0].id + 1, text: '', updatedTime: (new Date().getTime()), dirty: false});


        this.notes = this.__list[0];
        this.list = [...this.__list];
        this.setStorageData(this.__list);
        this.workspace.nativeElement.focus();
    }

    getStorageData() {
        let list = localStorage.getItem('note_list');
        
        if(!list || !((JSON.parse(list)).length)) {
            const initList = [{id: 1, text: '', dirty: false, updatedTime: (new Date()).getTime()}];
            localStorage.setItem('note_list', JSON.stringify(initList));
            return initList;
        }

        return JSON.parse(list);
    }

    setStorageData(data) {
        localStorage.setItem('note_list', JSON.stringify(data));
    }
}
