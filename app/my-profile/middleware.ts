import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
    console.log('here');
    return NextResponse.next();
}