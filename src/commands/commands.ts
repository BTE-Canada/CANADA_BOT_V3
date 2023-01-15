import { IP } from './tools/ip';
import { Command } from "./command";
import { TrialReview } from './admin/trial-review';
import { Baby } from './fun/baby';
import { Friday } from './fun/friday';
import { Gep } from './tools/gep';

export const Commands: Command[] = [
    // Admin
    TrialReview,

    // Fun
    Baby,
    Friday,

    // Tools
    Gep,
    IP
];