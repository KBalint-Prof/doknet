import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import { db } from '../db';
