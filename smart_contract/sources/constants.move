module checkin_nft::constants {
     const MAX_COMPLETION: u64 = 10000000; // tương đương 1.0
     const COMMON_RATE: u64 = 70;
     const EPIC_RATE: u64 = 25;


      public fun common_rate(): u64 { COMMON_RATE }
    public fun epic_rate(): u64 { EPIC_RATE }
    public fun max_completion(): u64 { MAX_COMPLETION }
}
