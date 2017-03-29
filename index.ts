class Gene {
    code: string;
    cost: number;

    constructor(code:string='') {
        this.code = code;
        this.cost = 9999;
    }

    random(length:number) {
        while (length--) {
            this.code += String.fromCharCode(Math.floor(Math.random()*255));
        }
    }

    calcCost(compareTo:string) {
        let total:number = 0;
        for (let i:number = 0; i < this.code.length; i++) {
            total += (this.code.charCodeAt(i) - compareTo.charCodeAt(i)) * (this.code.charCodeAt(i) - compareTo.charCodeAt(i));
        }
        this.cost = total;
    }

    mate(gene:Gene) {
        let pivot = Math.round(this.code.length / 2) - 1;
        let child1 = this.code.substr(0,pivot) + gene.code.substr(pivot);
        let child2 = gene.code.substr(0,pivot) + this.code.substr(pivot);

        return [new Gene(child1), new Gene(child2)];
    }

    mutate(chance:number) {
        if (Math.random() > chance) {
            return;
        }

        let index:number = Math.floor(Math.random()*this.code.length);
        let upOrDown:number = Math.random() <= 0.5 ? -1 : 1;
        let newChar:string = String.fromCharCode(this.code.charCodeAt(index) + upOrDown);
        let newString = '';
        for (let i:number = 0; i < this.code.length; i++) {
            if (i == index) newString += newChar;
            else newString += this.code[i];
        }

        this.code = newString;
    }

}

class Population {

    members:Array<Gene>;
    goal:string;
    generationNumber:number;

    constructor(goal:string, size:number) {
        this.goal = goal;
        this.members = [];
        this.generationNumber = 0;

        while(size--) {
            let gene = new Gene();
            gene.random(this.goal.length);
            this.members.push(gene);
        }
    }

    sort() {
        this.members.sort((a,b) => {
            return a.cost - b.cost;
        });
    }

    generation() {
        for (let member of this.members) {
            member.calcCost(this.goal)
        }

        this.sort();
        this.display();
        let children = this.members[0].mate(this.members[1]);
        this.members.splice(this.members.length - 2, 2, children[0], children[1]);

        for (let member of this.members) {
            member.mutate(0.3);
            member.calcCost(this.goal);

            if (member.code == this.goal) {
                this.sort();
                this.display();
                return true;
            }
        }

        this.generationNumber++;
        setTimeout(() => {
            this.generation();
        },20);
    }

    display() {
        console.log('Generation: ' + this.generationNumber);
        for (let member of this.members) {
            console.log(member.code + ' (' + member.cost + ')');
        }
    }
}

let population = new Population("Isn't that neat!", 100);
population.generation();