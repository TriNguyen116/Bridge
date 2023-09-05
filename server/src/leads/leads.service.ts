import { Inject, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token/token.service';
import { map } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead } from './schema/lead.schema';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class LeadsService {

  api_url = this.configService.get<string>('CORE_APIs');
  token = '';
  subLeadInfo: any;

  db = getFirestore();
  docRef = this.db.collection('leads')
  
  constructor(private http: HttpService, 
    private configService: ConfigService, 
    private tokenService: TokenService,
    @InjectModel(Lead.name) public leadModel: Model<Lead>,
    ) {

    let result = this.tokenService.getToken();
    result.subscribe((res) => {
      this.token = res.access_token;
    });
  }

  // createSub(body:any){
  //   return this.http.post(`${this.api_url}/Api/V8/module`, body, {
  //     headers: {
  //       Authorization: `Bearer ${this.token}`
  //     }
  //   }).pipe(map((response) => response.data));
  // }


  async create(body: any) {
    let result = this.http.post(`${this.api_url}/Api/V8/module`, body, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(map((response) => response.data));
      return result.pipe(map((res) => {
        console.log(res);
        return this.docRef.add(res);
    }))
  }

  async findAll() {
    try{
      const snapshot = await this.docRef.get();
      const users = snapshot.docs.map((doc) => doc.data().data);
      console.log(users);
      return users;
    }catch(err){
      console.log(err)
      return null;
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} lead`;
  }

  update(id: number, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}