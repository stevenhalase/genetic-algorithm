var Gene = (function () {
    function Gene(code) {
        if (code === void 0) { code = ''; }
        this.code = code;
        this.cost = 9999;
    }
    Gene.prototype.random = function (length) {
        while (length--) {
            this.code += String.fromCharCode(Math.floor(Math.random() * 255));
        }
    };
    Gene.prototype.calcCost = function (compareTo) {
        var total = 0;
        for (var i = 0; i < this.code.length; i++) {
            total += (this.code.charCodeAt(i) - compareTo.charCodeAt(i)) * (this.code.charCodeAt(i) - compareTo.charCodeAt(i));
        }
        this.cost = total;
    };
    Gene.prototype.mate = function (gene) {
        var pivot = Math.round(this.code.length / 2) - 1;
        var child1 = this.code.substr(0, pivot) + gene.code.substr(pivot);
        var child2 = gene.code.substr(0, pivot) + this.code.substr(pivot);
        return [new Gene(child1), new Gene(child2)];
    };
    Gene.prototype.mutate = function (chance) {
        if (Math.random() > chance) {
            return;
        }
        var index = Math.floor(Math.random() * this.code.length);
        var upOrDown = Math.random() <= 0.5 ? -1 : 1;
        var newChar = String.fromCharCode(this.code.charCodeAt(index) + upOrDown);
        var newString = '';
        for (var i = 0; i < this.code.length; i++) {
            if (i == index)
                newString += newChar;
            else
                newString += this.code[i];
        }
        this.code = newString;
    };
    return Gene;
}());
var Population = (function () {
    function Population(goal, size) {
        this.goal = goal;
        this.members = [];
        this.generationNumber = 0;
        while (size--) {
            var gene = new Gene();
            gene.random(this.goal.length);
            this.members.push(gene);
        }
    }
    Population.prototype.sort = function () {
        this.members.sort(function (a, b) {
            return a.cost - b.cost;
        });
    };
    Population.prototype.generation = function () {
        var _this = this;
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var member = _a[_i];
            member.calcCost(this.goal);
        }
        this.sort();
        this.display();
        var children = this.members[0].mate(this.members[1]);
        this.members.splice(this.members.length - 2, 2, children[0], children[1]);
        for (var _b = 0, _c = this.members; _b < _c.length; _b++) {
            var member = _c[_b];
            member.mutate(0.3);
            member.calcCost(this.goal);
            if (member.code == this.goal) {
                this.sort();
                this.display();
                return true;
            }
        }
        this.generationNumber++;
        setTimeout(function () {
            _this.generation();
        }, 20);
    };
    Population.prototype.display = function () {
        console.log('Generation: ' + this.generationNumber);
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var member = _a[_i];
            console.log(member.code + ' (' + member.cost + ')');
        }
    };
    return Population;
}());
var population = new Population("Isn't that neat!", 100);
population.generation();
