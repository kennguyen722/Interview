import java.util.*;public class StreamsDemo { public static void main(String[] a){ int sum=Arrays.asList(1,2,3,4).stream().filter(i->i%2==0).mapToInt(i->i).sum(); System.out.println(sum); }}
