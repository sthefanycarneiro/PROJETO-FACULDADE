
router.get("/count", async (req, res) => {
    try {
      const count = await Donor.countDocuments();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter o número de doadores" });
    }
  });
  