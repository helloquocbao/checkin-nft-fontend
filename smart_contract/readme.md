<!-- checkin_nft/
│
├── Move.toml
├── Move.lock
└── sources/
    ├── checkin_nft.move          # module chính: mint, upgrade, transfer
    ├── rarity_helper.move        # module phụ xử lý random rarity & completion
    ├── events.move               # module phụ định nghĩa event struct
    ├── constants.move            # chứa tỉ lệ gacha, min/max completion
    └── transfer_helper.move      # module phụ để cập nhật owner khi transfer -->
