// Deployment strategies enumeration and demo usage.
public class Solution {
  enum Strategy { BLUE_GREEN, CANARY, ROLLING }
  static String describe(Strategy s){ return switch(s){
    case BLUE_GREEN -> "Two environments; switch traffic after verification.";
    case CANARY -> "Gradually expose new version to % of users.";
    case ROLLING -> "Replace instances incrementally with zero downtime."; }; }
  public static void main(String[] args){ for(Strategy s: Strategy.values()) System.out.println(s+": "+describe(s)); }
}
