function Bloc(x,y,z){
	this.x = x
	this.y = y
	this.z = z
	this.state = 'normal';
}

let size = 3; // dimension du cube

let Cube = [];
let nbrBloc = size*size*size;

let x = 0;
let y = 0;
let z = 0;
let key = 0;
let origin = 0;


createCube(x,y,z,nbrBloc);
createConnection(Cube[nbrBloc-1],nbrBloc);

infect(origin);

let stime = testSpread(); // looking for contamination time

spread(true, stime);


function createCube(x,y,z,number){
	Cube[key] = new Bloc(x,y,z);
	Cube[key].key= key;
	
	x += 1;
	key += 1;
	if(x === size){
		x = 0;
		y += 1;
	}
	if(y === size){
		y = 0;
		z += 1;
	}
	const count = number - 1;
	if(count > 0){
		createCube(x,y,z,count);
	}
}

function createConnection(Bloc, number){
	Bloc.pairs = [];
	if(Bloc.x === 0){
		 Bloc.pairs[Bloc.pairs.length] = Cube[number+1]
		}else if(Bloc.x === size-1) {
		 Bloc.pairs[Bloc.pairs.length] = Cube[number-1]
		} else {
		 Bloc.pairs[Bloc.pairs.length] = Cube[number-1]
		 Bloc.pairs[Bloc.pairs.length] = Cube[number+1]
	}

	if(Bloc.y === 0){
		 Bloc.pairs[Bloc.pairs.length] = Cube[number+size]
		} else if (Bloc.y === size-1){
		 Bloc.pairs[Bloc.pairs.length] = Cube[number-size]
		} else {
		 Bloc.pairs[Bloc.pairs.length] = Cube[number-size]
		 Bloc.pairs[Bloc.pairs.length] = Cube[number+size]
	}
	if(Bloc.z === 0){
		 Bloc.pairs[Bloc.pairs.length] = Cube[number+(size*size)]
		} else if (Bloc.z === size-1){
		Bloc.pairs[Bloc.pairs.length] = Cube[number-(size*size)]
		} else {
		Bloc.pairs[Bloc.pairs.length] = Cube[number-(size*size)]
		Bloc.pairs[Bloc.pairs.length] = Cube[number+(size*size)]
	}
	const count = number -1;
	if(count > -1){
		createConnection(Cube[count],count)
	}
}

function infect(origin){
	Cube[origin].state = 'ongoing';
	console.log(`Le bloc ${origin} a ete infecte`);
}

function spread(recurv, time){
	let infected = Cube.filter(bloc => bloc.state == 'ongoing');
	let pairs = {}
	for(let countInfect = 0; countInfect < infected.length; countInfect++){
		let normals = infected[countInfect].pairs.filter(bloc => bloc.state == 'normal');
		for(let countNormals = 0; countNormals < normals.length; countNormals++){    // Looking for pairs uninfected
			let tempkey = normals[countNormals].key;
			if(pairs[tempkey] === undefined) pairs[tempkey] = normals[countNormals];
		}
	}

	infected.forEach(bloc => bloc.state = 'infected');			  // Changing old Cube to infected
	Object.values(pairs).forEach(bloc => bloc.state = 'ongoing');  // Changing the fresh one to ongoing
	
	let spreadview = Cube.filter(bloc => bloc.state == 'infected' || bloc.state == 'ongoing');
	if(spreadview.length < nbrBloc && recurv === true){
		let jourRestant = time -1;
		console.log("Taux de contamination journaliere : " + (Object.values(pairs).length /nbrBloc * 100).toFixed(2) + "%");
		console.log(`Temps avant contamination complete : ${jourRestant}`)
		spread(true , jourRestant);
	}
}

function testSpread(){
	let spreadtime = 0;
	let spreadview = [];
	let teston = true;

	while(teston){
		spreadview = Cube.filter(bloc => bloc.state == 'infected' || bloc.state == 'ongoing');
		if(spreadview.length < nbrBloc){
			spreadtime += 1;
			spread(Cube, false, 10);
		} else {
			teston = false
		}
	}
	reverse();
	
	return spreadtime -1 
}

function reverse(){
	let infected = Cube.filter(bloc => bloc.state == 'infected' || bloc.state == 'ongoing');
	for(let countInfect = 0; countInfect < infected.length; countInfect++){
		infected[countInfect].state = 'normal';
	}
	Cube[origin].state = 'ongoing';
}