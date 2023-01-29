import {promises as fs} from 'fs';
import {stdout} from 'process';

class ElfCalorieEntry {
    protected _heldCalories: number;

    constructor(heldCalories:number = 0) {
        this._heldCalories = heldCalories;
    }

    addCalories(numCalories: number) {
        this._heldCalories += numCalories;
    }

    get heldCalories(): number {
        return this._heldCalories;
    }
}

function getCalorieSumForTopElves(sortedElves: Array<ElfCalorieEntry>, numTopElves: number): number {
    if (numTopElves >= sortedElves.length)
        return -1;
    
    let totalSum = 0;
    for (let i = 0; i < numTopElves; ++i) {
        totalSum += sortedElves[i].heldCalories;
    }
    return totalSum;
}


function main() {
    let elfCalorieEntries: Array<ElfCalorieEntry> = [];

    fs.readFile('./input.txt', {encoding: 'utf8'}).then(
        (value) => {
            // Results in groups of calorie strings per-elf.
            let perElfCaloriesStrings: string[] = value.split("\r\n\r\n");
            
            for (let caloriesStoredStr of perElfCaloriesStrings) {
                // Results in an array of number parsable strings.
                let elfCalories = caloriesStoredStr.split("\r\n");
                let newElf = new ElfCalorieEntry();

                for (let calorieStr of elfCalories) {
                    let calorieNum: number = +calorieStr;
                    if (isNaN(calorieNum))
                        continue;
                    
                    newElf.addCalories(calorieNum);
                }

                elfCalorieEntries.push(newElf);
            }

            elfCalorieEntries.sort((a,b) => a.heldCalories > b.heldCalories ? -1 : 1);

            let topThreeCount = getCalorieSumForTopElves(elfCalorieEntries, 3);

            stdout.write(`Sum of top three elves count in elves: ${topThreeCount}`);
        }
    ).catch(
        (reason) => {
            stdout.write(`Failed to open input.txt: ${reason}`);
        }
    )

}

main();