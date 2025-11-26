
const handleICE = async (payload, viewerId, peerConRef) => {
  try {
    const peers = peerConRef.current;

    // Helper: add ICE to a peer connection
    const applyCandidate = async (pc, cand) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(cand));
      } catch (err) {
        console.warn("ICE candidate failed (not critical):", err);
      }
    };


    // -------------------------------------------------------
    // CASE 1 — Viewer: viewerId is null ⇒ single peer
    // -------------------------------------------------------
    if (viewerId == null) {
      const pc = peers; // single RTCPeerConnection

      if (!pc) {
        console.warn("Viewer peer connection not ready");
        return;
      }

      if (Array.isArray(payload)) {
        for (const cand of payload) await applyCandidate(pc, cand);
      } else {
        await applyCandidate(pc, payload);
      }

      return;
    }


    // -------------------------------------------------------
    // CASE 2 — Publisher: viewerId contains a real ID
    // -------------------------------------------------------
    const pc = peers[viewerId];

    if (!pc) {
      console.warn("No peer found for viewer:", viewerId);
      return;
    }

    if (Array.isArray(payload)) {
      for (const cand of payload) await applyCandidate(pc, cand);
    } else {
      await applyCandidate(pc, payload);
    }

  } catch (err) {
    console.error("Critical ICE handling error:", err);
  }
};

export default handleICE;