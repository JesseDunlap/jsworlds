module.exports = {
	hashCounter: 0,
	environment: {},
	define: function(name, def) {
		this.environment[name] = ["sub",def];
	},
	isAlphaNumeric: function(c) {
		return (c.search(/[A-Za-z0-9]/) != -1);
	},
	tokenize: function(str) {
		var tokens = [];
		var token = "";
		function la(i) { return str.substr(i,1); }
		function ok() { if (token != "") tokens.push(token); token = ""; }
		function yes(i) { ok(); tokens.push(i); }
		function whoops(k) { k.isKeyword=true; tokens.push(k); token = ""; }
		for(var i = 0; i < str.length; i++) {
			// Comments and White Space
			while (la(i) == "#" || la(i) == " " || la(i) == "\t" || la(i) == "\r" || la(i) == "\t") {
				if (la(i) == "#") {
					while (la(i) != "\n" && la(i) != "\r") i++;
				}
				i++;
			}
			while (la(i) == " " || la(i) == "\t" || la(i) == "\r" || la(i) == "\t") i++;
			
			// Special Chars
			if (la(i) == "{") yes("{");
			else if (la(i) == "}") yes("}");
			else if (la(i) == "(") yes("(");
			else if (la(i) == ")") yes(")");
			else if (la(i) == "[") yes("[");
			else if (la(i) == "]") yes("]");
			else if (la(i) == ".") yes(".");
			else if (la(i) == ",") yes(",");
			else if (la(i) == ";") yes(";");
			else if (la(i) == "!") yes("!");
			else if (la(i) == "+") yes("+");
			else if (la(i) == "-") yes("-");
			else if (la(i) == "*") yes("*");
			else if (la(i) == "/") yes("/");
			else if (la(i) == "=") yes("=");
			
			// Identifiers
			else if (this.isAlphaNumeric(la(i))) {
				ok();
				while (this.isAlphaNumeric(la(i))) {
					token += la(i);
					i++;
				}
				i--;
				if (token == "return") whoops("return");
				else if (token == "class") whoops("class");
				else if (token == "or") whoops("or");
				else if (token == "and") whoops("and");
				else if (token == "xor") whoops("xor");
				else ok();
			}
			
			while (la(i) == " " || la(i) == "\t" || la(i) == "\r" || la(i) == "\t") i++;
		}
		ok();
		return tokens;
	},
	parse: function(tokens) {
		var cur = 0;
		function look() { if(cur > tokens.length) return "EOF"; return tokens[cur]; }
		function gobble() { cur++; }
		function smack() { var k = look(); gobble(); return k; }
		function want(t) { var z = smack(); if (z != t) console.log("Wanted " + t + ", got " + z); }
		
		function pBody() {
			var ast = ["do"];
			ast.push(pStat());
			while (look() == ";") {
				gobble();
				ast.push(pStat());
			}
			return ast;
		}
		
		function pStat() {
			if (look() == "define") {
				gobble();
				var ast = ["define", pExp()];
				p.push(pBody());
				want("end");
			}
			else if (look() == "return") {
				gobble();
				return ["ret", pExp(1)];
			}
			else if (look() == "class") {
				var ast = [smack(), smack()];
				var extensions = [];
				if (look() == "(") {
					want("(");
					if (look() != ")") {
						extensions.push(pExp(1));
						while(look() == ",") {
							gobble();
							extensions.push(pExp(1));
						}
					}
					want(")");
				}
				ast.push(extensions);
				var fields = [];
				want("{");
				if (look() != "}") {
					fields.push(pExp(1));
					while(look() == ";") {
						gobble();
						fields.push(pExp(1));
					}
				}
				want("}");
				ast.push(fields);
				return ast;
			}
			else {
				return pExp(1);
			}
		}
		
		var table = [
			["=", "{"],
			["and","or","xor"],
			["+", "-"],
			["*", "/"],
			[".", "$"]
		];
		function pExp(n) {
			// Atom
			if (table.length+1 == n) {
				return ["sym", smack()];
			}
			// Operator
			else {
				var ast = pExp(n+1);
				if (table[n-1].indexOf(look()) != -1) {
					if (look() == "=") {
						gobble();
						var toWhat = pExp(n);
						if (ast[0] == "sym") {
							return ["=",ast,toWhat];
						} else {
							var n = ast.shift();
							return ["=",n,["fun",ast,["ret",toWhat]]];
						}
					}
					else if (look() == "{") {
						gobble();
						var toWhat = ["do",pStat()];
						while (look() == ";") {
							gobble();
							toWhat.push(pStat());
						}
						want("}");
						if (ast[0] == "sym") {
							return ["=",ast,toWhat];
						} else {
							var n = ast.shift();
							return ["=",n,["fun",ast,toWhat]];
						}
					}
					else {
						ast = [smack(), ast, pExp(n)];
					}
				}
				else if (table[n-1].indexOf("$") != -1 && look() == "(") {
					gobble();
					ast = [ast];
					if (look() == ")") gobble();
					else {
						ast.push(pExp(1));
						while (look() == ",") {
							gobble();
							ast.push(pExp(1));
						}
						want(")");
					}
				}
				return ast;
			}
		}
		
		var k = pBody();
		return k;
	},
	transform: function(ast) {
		function tr(f,e) {
			switch (f[0]) {
				case "do":
					var out = "";
					for(var i = 1; i < f.length; i++)
						out += e.tab + tr(f[i],e) + ";\n";
					return out;
				
				case "=":
					if (e.inClass) {
						return e.tab + tr(f[1],e) + ": " + tr(f[2],{ tab: e.tab, varDecls: [], inClass: false });
					}
					else {
						e.varDecls.push(f[1]);
						return tr(f[1],e) + " = " + tr(f[2],e);
					}
				
				case "+": "(" + tr(f[1],e) + "+" + tr(f[2],e) + ")";
				case "-": "(" + tr(f[1],e) + "-" + tr(f[2],e) + ")";
				case "*": "(" + tr(f[1],e) + "*" + tr(f[2],e) + ")";
				case "/": "(" + tr(f[1],e) + "/" + tr(f[2],e) + ")";
				case "and": "(" + tr(f[1],e) + "&&" + tr(f[2],e) + ")";
				case "or": "(" + tr(f[1],e) + "||" + tr(f[2],e) + ")";
				case "xor": var a=tr(f[1],e),b=tr(f[2],e);
							return "(("+a+"&&!"+b+")||("+b+"&&!"+a+"))";
				
				case "sym":
					return f[1];
				
				case "ret":
					return e.tab + "return " + tr(f[1],e) + ";";
				
				case "fun":
					var args = f[1];
					var ctx = { tab:e.tab +"\t", varDecls: [] };
					var bdy = tr(f[2],ctx);
					var out = "(function(";
					var f = true;
					for(var i = 0; i < args.length; i++) {
						if (!f) out += ","; 
						out += tr(args[i],{tab:"",varDecls:[],inClass:false});
						f = false;
					}
					out += "){\n";
					f = true;
					for (i = 0; i < ctx.varDecls.length; i++) {
						out += (f?"var ":",") + tr(ctx.varDecls[i],{tab:e.tab+"\t",varDecls:[], inClass:false});
						f = false;
					}
					out += (f?"":";") + bdy + "\r\n" + e.tab + "})";
					return out;
				
				case "class":
					e.varDecls.push(["sym",f[1]]);
					e.varDecls.push(["sym","_MC"]);
					var out = e.tab + f[1] + " = { isMojo: true, mojoId: "+(Mojo.hashCounter++)+"\n";
					for(var i = 0; i < f[3].length; i++) {
						out += "," + tr(f[3][i],{ varDecls: [], tab:e.tab+"\t", inClass: true }) + "\n";
					}
					out += e.tab + "};\n";
					for(var i = 0; i < f[2].length; i++) {
						var h = "_M"+(Mojo.hashCounter++);
						out += "_MC="+tr(f[2][i],e)+";";
						out += e.tab + "for(var "+h+" in _MC){";
						out +=f[1]+"["+h+"]=_MC["+h+"];";
						out += e.tab+"}\n";
					}
					return out;
				
				default:
					return "IDK!";
			}
		}
		var ctx = {
			varDecls: [],
			tab: "",
		};
		var bdy = tr(ast,ctx);
		var out = "";
		f = true;
		for (i = 0; i < ctx.varDecls.length; i++) {
			out += (f?"var ":",") + tr(ctx.varDecls[i],{tab:"",varDecls:[],inClass:false});
			f = false;
		}
		out += (f?"":";\r\n") + bdy;
		return out;
	},
	compile: function(code) {
		var s1 = Mojo.tokenize(code);
		var s2 = Mojo.parse(s1);
		var s3 = Mojo.transform(s2);
		console.log("[Mojo/Tokenize]: " + s1);
		console.log("[Mojo/Parser]: ");
		console.log(s2);
		console.log("[Mojo/Transform]: " + s3);
		return s3;
	}
};



