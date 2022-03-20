import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Pergunta } from './_models/pergunta';


declare var gtag: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form!: FormGroup;
  title = 'match-angular-app';
  submitted = false;
  perguntas: Pergunta[] = new Array();
  respostaServidor: String[] = new Array();
  hash: string = '';
  origem: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
    private http: HttpClient) {
      this.popularQuestionario();
      this.hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: [''],
      comentario: [''],
      'pergunta-1': [''],
      'pergunta-2': [''],
      'pergunta-3': [''],
      'pergunta-4': [''],
      'pergunta-5': [''],
      'pergunta-6': [''],
      'pergunta-7': [''],
      'pergunta-8': [''],
      'pergunta-9': [''],
      'pergunta-10': [''],
      'pergunta-11': [''],
      'pergunta-12': [''],
    });
  }

  primeiroAcesso: boolean = true;
  ngAfterViewInit() {
    console.log(this.route.queryParams);
    this.route.queryParams.subscribe(params => {
      this.origem = params['origem'];
      if (!this.origem ) {
        this.origem = 'Direto';
      } 
      if (!this.primeiroAcesso) {
        this.registraAcesso();
      }

      this.primeiroAcesso = false;
    });

  }

  private registraAcesso() {
    console.log(this.origem);
    this.http.post<String[]>(
      'http://agregadorpolitico.com:8000/access', 
      JSON.stringify(
        {
          "hash": this.hash,
          "origem": this.origem
        }
      ),
      {
        headers: { 'Content-Type': 'application/json' }, 
      }
    ).subscribe((resposta: String[]) => {
      console.log('access' + resposta);
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      console.log(this.perguntas);
      console.log(this.form.value);
      this.respostaServidor = new Array();

      this.http.post<String[]>(
        'http://agregadorpolitico.com:8000/match', 
        JSON.stringify(this.form.value),
        {
          headers: { 'Content-Type': 'application/json' }, 
        }
      ).subscribe((resposta: String[]) => {
        console.log('submit' + resposta);
        this.respostaServidor = resposta;
      });
    }
  }

  get f() { return this.form.controls; }

  private popularQuestionario() {
    
    let perguntasTxt: string[];
    perguntasTxt = [
      'Como você votaria no projeto da Reforma do Imposto de Renda (PL 2337/21)?',
      'Como você votaria no projeto da Autonomia do Banco Central (PLP 19/19)?',
      'Como você votaria no projeto da Privatização dos Correios (PL 591/2021)?',
      'Como você votaria no projeto que flexibiliza as regras de licenciamento ambiental (PL 3729/04)?',
      'Como você votaria no projeto que flexibiliza venda e porte de armas de fogo (PL 3723/19)?',
      'Como você votaria no projeto da Reforma da Previdência (PEC 06/2019)?',
      'Como você votaria no projeto da Reforma Eleitoral (PEC 125/2011)?',
      'Como você votaria no projeto da Reforma Trabalhista (MP 1045/21)?',
      'Como você votaria no projeto de privatização da Eletrobras (MP 1031/21)?',
      'Como você votaria no Pacote Anticrime (PL 10372/18)?',
      'Como você votaria no projeto do Voto Impresso (PEC 135/19)?',
      'Como você votaria no projeto do Teto de Gastos (PEC 241/2016)?'
    ]

    let i = 1;
    perguntasTxt.forEach((perguntaTxt: string) => {
      let pergunta = new Pergunta();
      pergunta.idPergunta = 'pergunta-' + i++;
      pergunta.label = perguntaTxt;
      this.perguntas.push(pergunta);
    });
  }
  onItemChange(id_question: any, answer: any) {

    let nome = this.form.getRawValue()['nome'];

    this.http.post<String[]>(
      'http://agregadorpolitico.com:8000/question', 
      JSON.stringify(
        {
          "nome": nome,
          "hash": this.hash,
          "id_question": id_question,
          "answer": answer,
          "origem": this.origem,
        }
      ),
      {
        headers: { 'Content-Type': 'application/json' }, 
      }
    ).subscribe((resposta: String[]) => {
      console.log('question' + resposta);
    });
  }
}
