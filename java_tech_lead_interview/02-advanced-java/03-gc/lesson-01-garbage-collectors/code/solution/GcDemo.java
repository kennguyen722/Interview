public class GcDemo { public static void main(String[] a){ byte[][] mem=new byte[1000][]; for(int i=0;i<mem.length;i++){ mem[i]=new byte[1024]; } System.out.println("Allocated"); }}
